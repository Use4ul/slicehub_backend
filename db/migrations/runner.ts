import { syncLogger } from "../../sys/logger";
import { dbConnection } from "../sequelize/index";
import { MigrationManager } from "./index";

// Утилиты для запуска миграций

// Выполняет миграции до указанной версии
export async function runMigrations(targetVersion?: number): Promise<void> {
    try {
        syncLogger.info("🚀 Starting migrations...");
        const migrationManager = new MigrationManager(dbConnection.getQueryInterface());
        await migrationManager.migrate({ targetVersion });
        syncLogger.info("✅ Migrations completed successfully");
    } catch (error) {
        syncLogger.error("❌ Migrations failed:", error);
        throw error;
    }
}

// Откатывает миграции до указанной версии
export async function rollbackMigrations(targetVersion: number = 0): Promise<void> {
    try {
        syncLogger.info("🔄 Rolling back migrations...");
        const migrationManager = new MigrationManager(dbConnection.getQueryInterface());
        await migrationManager.rollback(targetVersion);
        syncLogger.info("✅ Rollback completed successfully");
    } catch (error) {
        syncLogger.error("❌ Rollback failed:", error);
        throw error;
    }
}

// Показывает статус миграций
export async function showMigrationStatus(): Promise<void> {
    try {
        const migrationManager = new MigrationManager(dbConnection.getQueryInterface());
        await migrationManager.status();
    } catch (error) {
        syncLogger.error("❌ Failed to get migration status:", error);
        throw error;
    }
}

// Создает новую миграцию (утилита для разработки)
export function createMigrationTemplate(name: string): string {
    const migrationId = Object.keys(require("./index").migrations).length + 1;

    return `// db/migrations/${migrationId.toString().padStart(3, "0")}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ts
import { QueryInterface } from 'sequelize';
import { Migration } from './types';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    console.log('🔄 Running migration: ${name}');
    
    // TODO: Добавьте код миграции здесь
    
    console.log('✅ ${name} migration completed successfully');
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    console.log('🔄 Reverting migration: ${name}');
    
    // TODO: Добавьте код отката здесь
    
    console.log('✅ ${name} migration reverted successfully');
};

export default { up, down };
`;
}
