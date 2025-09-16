export interface CpuCore {
    core: number;
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
    total: number;
    timestamp: number;
}

export interface CpuUsage {
    core: number;
    usage: number;
    model: string;
    speed: number;
    isCurrent: boolean;
}

export interface MonitorData {
    cores: CpuUsage[];
    currentCore: CpuUsage;
    totalCpuUsage: number;
    eventLoop: {
        currentLag: string;
        avgLag: string;
        maxLag: string;
    };
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
    };
    timestamp: string;
    uptime: number;
    totalCores: number;
    osType: string;
    currentCoreId: number;
    platform: string;
}
