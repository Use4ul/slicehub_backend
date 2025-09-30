import { QueryInterface } from "sequelize";

export interface Migration {
    up(_queryInterface: QueryInterface): Promise<void>;
    down(_queryInterface: QueryInterface): Promise<void>;
}

export interface MigrationRecord {
    id: number;
    name: string;
    executed_at: Date;
}

export interface MigrationManagerOptions {
    targetVersion?: number; // До какой версии
}
