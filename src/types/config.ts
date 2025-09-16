export interface Settings {
    port: number;
    database?: {
        host: string;
        port: number;
        name: string;
        user: string;
        password: string;
    };
    logging?: {
        level: string;
        file?: string;
    };
}

export interface Configuration {
    settings: Settings;
}

export interface MonitoringSettings {
    reqInterval?: number;
}

export interface AppSettings {
    osType?: string;
}

export interface AppConfig {
    settings?: AppSettings;
    monitoringSettings?: MonitoringSettings;
}
