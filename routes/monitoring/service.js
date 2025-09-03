const os = require('os');
const { mainLogger } = require('../../sys/logger');

// Переменные для мониторинга
let eventLoopLag = 0;
let eventLoopSamples = [];
let currentCoreId = 0;
let coreRotationTime = 0;
let previousCoresInfo = getCoresInfo();

// Мониторинг задержки Event Loop
function monitorEventLoop() {
    const start = process.hrtime();

    setImmediate(() => {
        const delta = process.hrtime(start);
        const nanoseconds = delta[0] * 1e9 + delta[1];
        eventLoopLag = nanoseconds / 1e6;

        eventLoopSamples.push(eventLoopLag);
        if (eventLoopSamples.length > 10) {
            eventLoopSamples.shift();
        }

        // Симуляция смены ядер
        coreRotationTime++;
        if (coreRotationTime % 30 === 0) {
            currentCoreId = Math.floor(Math.random() * os.cpus().length);
            mainLogger.debug(`Process migrated to core: ${currentCoreId}`);
        }
    });
}

// Функция для получения информации по ядрам
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

// Функция расчета загрузки по ядрам
function calculateCoresUsage() {
    const currentCoresInfo = getCoresInfo();
    const coresUsage = [];

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
            isCurrent: index === currentCoreId,
        });
    });

    previousCoresInfo = currentCoresInfo;
    return coresUsage;
}

// Получение всех данных мониторинга
function getMonitorData() {
    const coresUsage = calculateCoresUsage();
    const memoryUsage = process.memoryUsage();
    const currentCore = coresUsage.find((core) => core.isCurrent);
    const totalCpuUsage = coresUsage.reduce((sum, core) => sum + core.usage, 0) / coresUsage.length;
    const avgEventLoopLag =
        eventLoopSamples.length > 0 ? eventLoopSamples.reduce((sum, lag) => sum + lag, 0) / eventLoopSamples.length : 0;

    return {
        cores: coresUsage,
        currentCore: currentCore,
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
    };
}

// Получение сырых данных CPU
function getRawCpuData() {
    return getCoresInfo();
}

module.exports = {
    monitorEventLoop,
    getCoresInfo,
    calculateCoresUsage,
    getMonitorData,
    getRawCpuData,
    eventLoopLag,
    eventLoopSamples,
};
