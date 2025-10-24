import { syncLogger } from "../../sys/logger";
import { dbConnection } from "../sequelize/index";
import { MigrationManager } from "./index";
import { EMOJI } from "../../src/utils/emojis";

// Утилиты для запуска миграций

// Выполняет миграции до указанной версии
export async function runMigrations(targetVersion?: number): Promise<void> {
    try {
        syncLogger.info(`${EMOJI.ROCKET} Starting migrations...`);
        const migrationManager = new MigrationManager(dbConnection.getQueryInterface());
        await migrationManager.migrate({ targetVersion });
        syncLogger.info(`${EMOJI.SUCCESS} Migrations completed successfully`);
    } catch (error) {
        syncLogger.error(`${EMOJI.ERROR} Migrations failed:`, error);
        throw error;
    }
}

// Откатывает миграции до указанной версии
export async function rollbackMigrations(targetVersion: number = 0): Promise<void> {
    try {
        syncLogger.info(`${EMOJI.ROLLBACK} Rolling back migrations...`);
        const migrationManager = new MigrationManager(dbConnection.getQueryInterface());
        await migrationManager.rollback(targetVersion);
        syncLogger.info(`${EMOJI.SUCCESS} Rollback completed successfully`);
    } catch (error) {
        syncLogger.error(`${EMOJI.ERROR} Rollback failed:`, error);
        throw error;
    }
}

// Показывает статус миграций
export async function showMigrationStatus(): Promise<void> {
    try {
        const migrationManager = new MigrationManager(dbConnection.getQueryInterface());
        await migrationManager.status();
    } catch (error) {
        syncLogger.error(`${EMOJI.ERROR} Failed to get migration status:`, error);
        throw error;
    }
}

