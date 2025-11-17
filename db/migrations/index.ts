import { QueryInterface } from "sequelize";
import { syncLogger } from "../../sys/logger";
import { Migration, MigrationRecord, MigrationManagerOptions } from "./types";
import { EMOJI } from "../../src/utils/emojis";
import { getSchemaPrefix } from "./utils";

// Импорты миграций
import migration001 from "./migrationsFiles/001-create-case-insensitive-indexes";
import migration002 from "./migrationsFiles/002-add-username-validation-constraint";

// Реестр всех миграций в порядке выполнения
const migrationsRegistry: { [key: number]: Migration } = {
    1: migration001,
    2: migration002,
};

export class MigrationManager {
    private queryInterface: QueryInterface;
    private schemaPrefix: string;

    constructor(queryInterface: QueryInterface) {
        this.queryInterface = queryInterface;
        this.schemaPrefix = getSchemaPrefix();
    }

    // Получает список выполненных миграций
    private async getExecutedMigrations(): Promise<MigrationRecord[]> {
        const [results] = await this.queryInterface.sequelize.query(`
            SELECT id, name, executed_at 
            FROM ${this.schemaPrefix}"migrations" 
            ORDER BY id ASC
        `);

        return results as MigrationRecord[];
    }

    // Добавляет запись о выполненной миграции
    private async addMigrationRecord(name: string): Promise<void> {
        await this.queryInterface.sequelize.query(
            `
            INSERT INTO ${this.schemaPrefix}"migrations" (name, executed_at) 
            VALUES (:name, CURRENT_TIMESTAMP)
        `,
            {
                replacements: { name },
            }
        );
    }

    // Удаляет запись о миграции (для отката)
    private async removeMigrationRecord(id: number): Promise<void> {
        await this.queryInterface.sequelize.query(
            `
            DELETE FROM ${this.schemaPrefix}"migrations" WHERE id = :id
        `,
            {
                replacements: { id },
            }
        );
    }

    // Выполняет миграции до указанной версии
    async migrate(options: MigrationManagerOptions = {}): Promise<void> {
        const { targetVersion } = options;
        const executedMigrations = await this.getExecutedMigrations();
        const executedIds = new Set(executedMigrations.map((m) => m.id));

        const migrationIds = Object.keys(migrationsRegistry)
            .map(Number)
            .sort((a, b) => a - b);

        const targetId = targetVersion || Math.max(...migrationIds);

        syncLogger.info(`${EMOJI.TARGET} Target migration version: ${targetId}`);
        syncLogger.info(`${EMOJI.CHART} Executed migrations: ${executedMigrations.length}`);

        // Выполняем миграции
        for (const migrationId of migrationIds) {
            if (migrationId > targetId) break;

            if (!executedIds.has(migrationId)) {
                syncLogger.info(`${EMOJI.MIGRATION} Running migration #${migrationId}...`);

                try {
                    await migrationsRegistry[migrationId].up(this.queryInterface);
                    await this.addMigrationRecord(`migration_${migrationId}`);
                    syncLogger.info(`${EMOJI.SUCCESS} Migration #${migrationId} completed successfully`);
                } catch (error) {
                    syncLogger.error(`${EMOJI.ERROR} Migration #${migrationId} failed:`, error);
                    throw error;
                }
            } else {
                syncLogger.warn(`${EMOJI.SKIP} Migration #${migrationId} already executed, skipping`);
            }
        }

        syncLogger.info(`${EMOJI.SUCCESS} All migrations completed successfully`);
    }

    // Откатывает миграции до указанной версии
    async rollback(targetVersion: number = 0): Promise<void> {
        const executedMigrations = await this.getExecutedMigrations();

        // Откатываем в обратном порядке
        for (const migration of executedMigrations.reverse()) {
            if (migration.id <= targetVersion) break;

            syncLogger.info(`${EMOJI.ROLLBACK} Rolling back migration #${migration.id}...`);

            try {
                await migrationsRegistry[migration.id].down(this.queryInterface);
                await this.removeMigrationRecord(migration.id);
                syncLogger.info(`${EMOJI.SUCCESS} Migration #${migration.id} rolled back successfully`);
            } catch (error) {
                syncLogger.error(`${EMOJI.ERROR} Rollback of migration #${migration.id} failed:`, error);
                throw error;
            }
        }

        syncLogger.info(`${EMOJI.SUCCESS} Rollback completed successfully`);
    }

    // Показывает статус миграций
    async status(): Promise<void> {
        const executedMigrations = await this.getExecutedMigrations();
        const executedIds = new Set(executedMigrations.map((m) => m.id));
        const migrationIds = Object.keys(migrationsRegistry)
            .map(Number)
            .sort((a, b) => a - b);

        syncLogger.info(`\n${EMOJI.CHART} Migration Status:`);
        syncLogger.info("===================");

        for (const migrationId of migrationIds) {
            const status = executedIds.has(migrationId) ? `${EMOJI.SUCCESS} EXECUTED` : `⏳ PENDING`;
            syncLogger.info(`#${migrationId}: ${status}`);
        }

        if (executedMigrations.length === migrationIds.length) {
            syncLogger.info(`\n${EMOJI.FINISH} All migrations are up to date!`);
        } else {
            syncLogger.info(
                `\n${EMOJI.CHART} ${migrationIds.length - executedMigrations.length} migration(s) pending`
            );
        }
    }
}

// Экспорт миграций для runner
export const migrations = migrationsRegistry;

export { Migration, MigrationRecord, MigrationManagerOptions };
