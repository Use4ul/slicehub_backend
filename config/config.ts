export interface Settings {
    port: number;
    database?: string;
    logging?: LoggingConfig;
    osType?: string;
}

export interface DatabaseSettings {
    container_name?: string;
    host: string;
    port: string | number;
    database: string;
    dialect: string;
    logging: boolean;
    benchmark: boolean;
    schema?: string;
    user: string;
}

export interface DatabaseAuth {
    login: string;
    password: string;
}

export interface LoggingConfig {
    level: string;
    file?: string;
}

export interface MonitoringSettings {
    reqInterval?: number;
    x_seconds?: number;
    coreUpdate?: number;
    osType?: string;
}

export interface SyncOptions {
    forсe: boolean;
    alter: boolean;
}

export interface Configuration {
    appName: string;
    settings: Settings;
    DB: {
        [key: string]: DatabaseSettings;
    };
    auth: {
        [key: string]: DatabaseAuth;
    };
    monitoringSettings?: MonitoringSettings;
    syncOptions: SyncOptions;
    devUsers: string[];
}
