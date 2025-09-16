import { exec } from 'child_process';
import * as os from 'os';

import conf from '../../../conf.json';
import { mainLogger } from '../../../sys/logger';

interface CpuCore {
    core: number;
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
    total: number;
    timestamp: number;
}

interface CpuUsage {
    core: number;
    usage: number;
    model: string;
    speed: number;
    isCurrent: boolean;
}

interface MemoryUsage {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
}

interface EventLoopData {
    currentLag: string;
    avgLag: string;
    maxLag: string;
}

interface MonitorData {
    cores: CpuUsage[];
    currentCore: CpuUsage;
    totalCpuUsage: number;
    eventLoop: EventLoopData;
    memory: MemoryUsage;
    timestamp: string;
    uptime: number;
    totalCores: number;
    osType: string;
    currentCoreId: number;
    platform: string;
}

interface CoreCache {
    value: number;
    timestamp: number;
}

let eventLoopLag = 0;
const eventLoopSamples: number[] = [];
let previousCoresInfo: CpuCore[] = getCoresInfo();
const coreCache: CoreCache = {
    value: process.pid % os.cpus().length,
    timestamp: Date.now(),
};

function detectOSType(): string {
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

const osType = (conf as any).settings?.osType || detectOSType();
mainLogger.info(`Operating system detected: ${osType} (platform: ${os.platform()})`);

export async function getCurrentCoreWindows(): Promise<number> {
    return new Promise((resolve) => {
        try {
            const pid = process.pid;
            exec(
                `wmic process where processid=${pid} get processorid`,
                { timeout: 1000 },
                (error, stdout) => {
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
                                    resolve(coreId);
                                    return;
                                }
                            }
                        }
                        resolve(process.pid % os.cpus().length);
                    } catch {
                        mainLogger.debug('Windows core parsing failed');
                        resolve(process.pid % os.cpus().length);
                    }
                }
            );
        } catch {
            mainLogger.warn('Windows core detection error');
            resolve(process.pid % os.cpus().length);
        }
    });
}

export async function getCurrentCoreLinux(): Promise<number> {
    return new Promise((resolve) => {
        try {
            const pid = process.pid;
            exec(`ps -o psr -p ${pid} | tail -1`, { timeout: 1000 }, (error, stdout) => {
                if (error) {
                    resolve(process.pid % os.cpus().length);
                    return;
                }
                try {
                    const coreId = parseInt(stdout.trim(), 10);
                    resolve(!isNaN(coreId) ? coreId : process.pid % os.cpus().length);
                } catch {
                    resolve(process.pid % os.cpus().length);
                }
            });
        } catch {
            resolve(process.pid % os.cpus().length);
        }
    });
}

export async function getCurrentCoreMacOS(): Promise<number> {
    return new Promise((resolve) => {
        try {
            const pid = process.pid;
            exec(`ps -o cpuid -p ${pid} | tail -1`, { timeout: 1000 }, (error, stdout) => {
                if (error) {
                    resolve(process.pid % os.cpus().length);
                    return;
                }
                try {
                    const coreId = parseInt(stdout.trim(), 10);
                    resolve(!isNaN(coreId) ? coreId : process.pid % os.cpus().length);
                } catch (error) {
                    mainLogger.info('Error in getCurrentCoreMacOS exec: ', error);
                    resolve(process.pid % os.cpus().length);
                }
            });
        } catch (error) {
            mainLogger.info('Error in getCurrentCoreMacOS: ', error);
            resolve(process.pid % os.cpus().length);
        }
    });
}

export async function updateCurrentCore(): Promise<void> {
    try {
        let coreId: number;
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
        }
    } catch (error) {
        mainLogger.warn(`Core detection error: ${(error as Error).message}`);
    }
}

export function getCurrentCoreSync(): number {
    return coreCache.value;
}

export function monitoringEventLoop(): void {
    const start = process.hrtime();
    setImmediate(() => {
        const delta = process.hrtime(start);
        const nanoseconds = delta[0] * 1e9 + delta[1];
        eventLoopLag = nanoseconds / 1e6;
        eventLoopSamples.push(eventLoopLag);
        if (eventLoopSamples.length > 10) eventLoopSamples.shift();
        if (Date.now() % 10000 < 100) {
            updateCurrentCore().catch((error) => {
                mainLogger.debug(`Core update error: ${error.message}`);
            });
        }
    });
}

export function getCoresInfo(): CpuCore[] {
    const cpus = os.cpus();
    return cpus.map((cpu, index) => ({
        core: index,
        user: cpu.times.user,
        nice: cpu.times.nice,
        sys: cpu.times.sys,
        idle: cpu.times.idle,
        irq: cpu.times.irq,
        total: Object.values(cpu.times).reduce((sum, time) => sum + time, 0),
        timestamp: Date.now(),
    }));
}

export function calculateCoresUsage(): CpuUsage[] {
    const currentCoresInfo = getCoresInfo();
    const coresUsage: CpuUsage[] = [];
    const currentCoreId = getCurrentCoreSync();

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

export function getMonitorData(): MonitorData {
    const coresUsage = calculateCoresUsage();
    const memoryUsage = process.memoryUsage();
    const currentCoreId = getCurrentCoreSync();
    const currentCore = coresUsage.find((core) => core.core === currentCoreId) || {
        core: currentCoreId,
        usage: 0,
        isCurrent: true,
        model: '',
        speed: 0,
    };
    const totalCpuUsage = coresUsage.reduce((sum, core) => sum + core.usage, 0) / coresUsage.length;
    const avgEventLoopLag =
        eventLoopSamples.length > 0
            ? eventLoopSamples.reduce((sum, lag) => sum + lag, 0) / eventLoopSamples.length
            : 0;

    return {
        cores: coresUsage,
        currentCore,
        totalCpuUsage,
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
        osType,
        currentCoreId,
        platform: os.platform(),
    };
}

export function getRawCpuData(): CpuCore[] {
    return getCoresInfo();
}

updateCurrentCore()
    .then(() => {
        mainLogger.info(`Initial CPU core: ${getCurrentCoreSync()} on ${osType}`);
    })
    .catch((error) => {
        mainLogger.warn(`Initial core detection failed: ${error.message}`);
    });
