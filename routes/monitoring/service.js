const os = require('os');
const { exec } = require('child_process');
const { mainLogger } = require('../../sys/logger');
const conf = require('../../conf.json');

// Переменные для мониторинга
let eventLoopLag = 0;
let eventLoopSamples = [];
let previousCoresInfo = getCoresInfo();

// Кэш для хранения ядра
let coreCache = {
    value: process.pid % os.cpus().length, // начальное значение
    timestamp: Date.now(),
};

/**
 * Автоматическое определение типа ОС
 */
function detectOSType() {
    const platform = os.platform();

    switch (platform) {
        case 'win32':
            return 'windows';
        case 'linux':
            return 'linux';
        case 'darwin':
            return 'macos';
        default:
            return 'unknown';
    }
}

// Определяем тип ОС
const osType = conf.settings.osType || detectOSType();
mainLogger.info(`Operating system detected: ${osType} (platform: ${os.platform()})`);

/**
 * Определение ядра для Windows
 */

async function getCurrentCoreWindows() {
    return new Promise((resolve) => {
        try {
            const pid = process.pid;

            exec(`wmic process where processid=${pid} get processorid`, { timeout: 1000 }, (error, stdout, stderr) => {
                if (error) {
                    mainLogger.debug('WMIC failed, using fallback');
                    resolve(process.pid % os.cpus().length);
                    return;
                }

                try {
                    const lines = stdout
                        .trim()
                        .split('\r\n')
                        .filter((line) => line.trim());
                    if (lines.length > 1) {
                        for (let i = 1; i < lines.length; i++) {
                            const coreId = parseInt(lines[i].trim(), 10);
                            if (!isNaN(coreId)) {
                                mainLogger.debug(`Windows core detected: ${coreId}`);
                                resolve(coreId);
                                return;
                            }
                        }
                    }
                    resolve(process.pid % os.cpus().length);
                } catch (e) {
                    mainLogger.debug('Windows core parsing failed');
                    resolve(process.pid % os.cpus().length);
                }
            });
        } catch (error) {
            mainLogger.warn('Windows core detection error');
            resolve(process.pid % os.cpus().length);
        }
    });
}

/**
 * Определение ядра для Linux
 */
async function getCurrentCoreLinux() {
    return new Promise((resolve) => {
        try {
            const pid = process.pid;

            exec(`ps -o psr -p ${pid} | tail -1`, { timeout: 1000 }, (error, stdout, stderr) => {
                if (error) {
                    mainLogger.debug('PS failed, using fallback');
                    resolve(process.pid % os.cpus().length);
                    return;
                }

                try {
                    const coreId = parseInt(stdout.trim(), 10);
                    if (!isNaN(coreId)) {
                        mainLogger.debug(`Linux core detected: ${coreId}`);
                        resolve(coreId);
                    } else {
                        resolve(process.pid % os.cpus().length);
                    }
                } catch (e) {
                    mainLogger.debug('Linux core parsing failed');
                    resolve(process.pid % os.cpus().length);
                }
            });
        } catch (error) {
            mainLogger.warn('Linux core detection error');
            resolve(process.pid % os.cpus().length);
        }
    });
}

/**
 * Определение ядра для macOS
 */
async function getCurrentCoreMacOS() {
    return new Promise((resolve) => {
        try {
            const pid = process.pid;

            exec(`ps -o cpuid -p ${pid} | tail -1`, { timeout: 1000 }, (error, stdout, stderr) => {
                if (error) {
                    mainLogger.debug('macOS core detection failed, using fallback');
                    resolve(process.pid % os.cpus().length);
                    return;
                }

                try {
                    const coreId = parseInt(stdout.trim(), 10);
                    if (!isNaN(coreId)) {
                        mainLogger.debug(`macOS core detected: ${coreId}`);
                        resolve(coreId);
                    } else {
                        resolve(process.pid % os.cpus().length);
                    }
                } catch (e) {
                    mainLogger.debug('macOS core parsing failed');
                    resolve(process.pid % os.cpus().length);
                }
            });
        } catch (error) {
            mainLogger.warn('macOS core detection error');
            resolve(process.pid % os.cpus().length);
        }
    });
}

/**
 * Асинхронное определение ядра (обновляет кэш)
 */
async function updateCurrentCore() {
    try {
        let coreId;

        switch (osType) {
            case 'windows':
                coreId = await getCurrentCoreWindows();
                break;

            case 'linux':
                coreId = await getCurrentCoreLinux();
                break;

            case 'macos':
                coreId = await getCurrentCoreMacOS();
                break;

            default:
                coreId = process.pid % os.cpus().length;
        }

        if (coreId !== coreCache.value) {
            coreCache.value = coreId;
            coreCache.timestamp = Date.now();
            mainLogger.info(`CPU core changed to: ${coreId} (OS: ${osType})`);
        }
    } catch (error) {
        mainLogger.warn(`Core detection error for ${osType}: ${error.message}`);
    }
}

/**
 * Синхронное получение ядра из кэша
 */
function getCurrentCoreSync() {
    return coreCache.value;
}

/**
 * Мониторинг задержки Event Loop
 */
function monitoringEventLoop() {
    const start = process.hrtime();

    setImmediate(() => {
        const delta = process.hrtime(start);
        const nanoseconds = delta[0] * 1e9 + delta[1];
        eventLoopLag = nanoseconds / 1e6;

        eventLoopSamples.push(eventLoopLag);
        if (eventLoopSamples.length > 10) {
            eventLoopSamples.shift();
        }

        // Обновляем ядро реже, чтобы уменьшить нагрузку
        if (Date.now() % 10000 < 100) {
            updateCurrentCore().catch((error) => {
                mainLogger.debug(`Core update error: ${error.message}`);
            });
        }
    });
}

/**
 * Функция для получения информации по ядрам
 */
function getCoresInfo() {
    const cpus = os.cpus();
    const coresInfo = [];

    cpus.forEach((cpu, index) => {
        let total = 0;
        for (let type in cpu.times) {
            total += cpu.times[type];
        }

        coresInfo.push({
            core: index,
            user: cpu.times.user,
            nice: cpu.times.nice,
            sys: cpu.times.sys,
            idle: cpu.times.idle,
            irq: cpu.times.irq,
            total: total,
            timestamp: Date.now(),
        });
    });

    return coresInfo;
}

/**
 * Функция расчета загрузки по ядрам
 */
function calculateCoresUsage() {
    const currentCoresInfo = getCoresInfo();
    const coresUsage = [];
    const currentCoreId = getCurrentCoreSync(); // ← Используем синхронный геттер

    currentCoresInfo.forEach((currentCore, index) => {
        const previousCore = previousCoresInfo[index];
        const elapsedTime = currentCore.timestamp - previousCore.timestamp;

        const idleDifference = currentCore.idle - previousCore.idle;
        const totalDifference = currentCore.total - previousCore.total;

        let usagePercent = 0;
        if (totalDifference > 0 && elapsedTime > 0) {
            usagePercent = 100 - (100 * idleDifference) / totalDifference;
        }

        coresUsage.push({
            core: index,
            usage: Math.min(Math.max(usagePercent, 0), 100),
            model: os.cpus()[index].model,
            speed: os.cpus()[index].speed,
            isCurrent: index === currentCoreId, // ← Безопасное использование
        });
    });

    previousCoresInfo = currentCoresInfo;
    return coresUsage;
}

/**
 * Получение всех данных мониторинга
 */
function getMonitorData() {
    const coresUsage = calculateCoresUsage();
    const memoryUsage = process.memoryUsage();
    const currentCoreId = getCurrentCoreSync(); // ← Синхронный геттер
    const currentCore = coresUsage.find((core) => core.core === currentCoreId);
    const totalCpuUsage = coresUsage.reduce((sum, core) => sum + core.usage, 0) / coresUsage.length;
    const avgEventLoopLag =
        eventLoopSamples.length > 0 ? eventLoopSamples.reduce((sum, lag) => sum + lag, 0) / eventLoopSamples.length : 0;

    return {
        cores: coresUsage,
        currentCore: currentCore || { core: currentCoreId, usage: 0, isCurrent: true },
        totalCpuUsage: totalCpuUsage,
        eventLoop: {
            currentLag: eventLoopLag.toFixed(2),
            avgLag: avgEventLoopLag.toFixed(2),
            maxLag: Math.max(...eventLoopSamples, 0).toFixed(2),
        },
        memory: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            external: Math.round(memoryUsage.external / 1024 / 1024),
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        totalCores: os.cpus().length,
        osType: osType,
        currentCoreId: currentCoreId,
        platform: os.platform(),
    };
}

function getRawCpuData() {
    return getCoresInfo();
}

// Инициализация при загрузке
updateCurrentCore()
    .then(() => {
        mainLogger.info(`Initial CPU core: ${getCurrentCoreSync()} on ${osType}`);
    })
    .catch((error) => {
        mainLogger.warn(`Initial core detection failed: ${error.message}`);
    });

module.exports = {
    monitoringEventLoop,
    getCoresInfo,
    calculateCoresUsage,
    getMonitorData,
    getRawCpuData,
    updateCurrentCore,
    getCurrentCoreSync, // ← Экспортируем синхронный геттер
    eventLoopLag: () => eventLoopLag,
    eventLoopSamples: () => eventLoopSamples,
    osType: () => osType,
    platform: () => os.platform(),
};
