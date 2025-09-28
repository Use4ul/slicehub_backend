export interface DatabaseConfig {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
}

export interface LoggingConfig {
    level: string;
    file?: string;
}

export interface Settings {
    port: number;
    database?: string; // Изменено на string, чтобы соответствовать conf.json
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

export interface MonitoringSettings {
    reqInterval?: number;
}

export interface Configuration {
    settings: Settings;
    DB?: {
        [key: string]: DatabaseSettings;
    };
    auth?: {
        [key: string]: DatabaseAuth;
    };
    monitoringSettings?: MonitoringSettings;
    syncOptions: SyncOptions;
}

export interface SyncOptions {
    forсe: boolean;
    alter: boolean;
}