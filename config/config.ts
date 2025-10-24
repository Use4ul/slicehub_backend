export interface MockSeedingOptions {
    enableMockSeeds: boolean;   // Включить/выключить генерацию тестовых данных
    mockSeedsRunCount: number;  // Сколько раз выполнить генерацию (за один запуск приложения)
}

export interface SyncOptions {
    force: boolean;
    alter: boolean;
    mockSeeding: MockSeedingOptions;
}

export interface Settings {
    port: number;
    database?: string;
    logging?: LoggingConfig;
    osType?: string;
    sync: SyncOptions;
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

export interface Configuration {
    appName: string;
    settings: Settings;
    db: {
        [key: string]: DatabaseSettings;
    };
    auth: {
        [key: string]: DatabaseAuth;
    };
    monitoringSettings?: MonitoringSettings;
    devUsers: string[];
}
