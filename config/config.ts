export interface MockSeedingConfig {
    enableMockSeeds: boolean;
    mockSeedsRunCount: number;
}

export interface SyncConfig {
    force: boolean;
    alter: boolean;
    mockSeeding: MockSeedingConfig;
}

export interface Settings {
    port: number;
    database: string;
    sync: SyncConfig;
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
    reqInterval: number;
    x_seconds: number;
    coreUpdate: number;
    osType: string;
}

export interface S3Buckets {
    models: string;
    previews: string;
    avatars: string;
    attachments: string;
}

export interface S3Config {
    endpoint: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    buckets: S3Buckets;
    forcePathStyle: boolean;
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
    monitoringSettings: MonitoringSettings;
    s3?: S3Config;
    devUsers: string[];
}
