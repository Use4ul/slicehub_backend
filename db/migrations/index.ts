import { QueryInterface } from 'sequelize';
import { Migration, MigrationRecord, MigrationManagerOptions } from './types';

// Импорты миграций
import migration001 from './migrationsFiles/001-create-case-insensitive-indexes';
import { syncLogger } from '../../sys/logger';

// Реестр всех миграций в порядке выполнения
const migrationsRegistry: { [key: number]: Migration } = {
    1: migration001,
};

export class MigrationManager {
    private queryInterface: QueryInterface;
    
    constructor(queryInterface: QueryInterface) {
        this.queryInterface = queryInterface;
    }

    // Создает таблицу для отслеживания выполненных миграций
    private async ensureMigrationsTable(): Promise<void> {
        const tableExists = await this.queryInterface.showAllTables()
            .then(tables => tables.includes('migrations'));
            
        if (!tableExists) {
            await this.queryInterface.createTable('migrations', {
                id: {
                    type: 'INTEGER',
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: 'VARCHAR(255)',
                    allowNull: false,
                },
                executed_at: {
                    type: 'TIMESTAMP',
                    allowNull: false,
                    defaultValue: this.queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
                },
            });
            syncLogger.info('✅ Migrations table created');
        }
    }

    // Получает список выполненных миграций
    private async getExecutedMigrations(): Promise<MigrationRecord[]> {
        await this.ensureMigrationsTable();
        
        const [results] = await this.queryInterface.sequelize.query(`
            SELECT id, name, executed_at 
            FROM migrations 
            ORDER BY id ASC
        `);
        
        return results as MigrationRecord[];
    }

    // Добавляет запись о выполненной миграции
    private async addMigrationRecord(name: string): Promise<void> {
        await this.queryInterface.sequelize.query(`
            INSERT INTO migrations (name, executed_at) 
            VALUES (:name, CURRENT_TIMESTAMP)
        `, {
            replacements: { name }
        });
    }

    // Удаляет запись о миграции (для отката)
    private async removeMigrationRecord(id: number): Promise<void> {
        await this.queryInterface.sequelize.query(`
            DELETE FROM migrations WHERE id = :id
        `, {
            replacements: { id }
        });
    }

    // Выполняет миграции до указанной версии
    async migrate(options: MigrationManagerOptions = {}): Promise<void> {
        const { targetVersion } = options;
        const executedMigrations = await this.getExecutedMigrations();
        const executedIds = new Set(executedMigrations.map(m => m.id));
        
        const migrationIds = Object.keys(migrationsRegistry)
            .map(Number)
            .sort((a, b) => a - b);
        
        const targetId = targetVersion || Math.max(...migrationIds);
        
        syncLogger.info(`🎯 Target migration version: ${targetId}`);
        syncLogger.info(`📊 Executed migrations: ${executedMigrations.length}`);

        // Выполняем миграции
        for (const migrationId of migrationIds) {
            if (migrationId > targetId) break;
            
            if (!executedIds.has(migrationId)) {
                syncLogger.info(`🔄 Running migration #${migrationId}...`);
                
                try {
                    await migrationsRegistry[migrationId].up(this.queryInterface);
                    await this.addMigrationRecord(`migration_${migrationId}`);
                    syncLogger.info(`✅ Migration #${migrationId} completed successfully`);
                } catch (error) {
                    console.error(`❌ Migration #${migrationId} failed:`, error);
                    throw error;
                }
            } else {
                syncLogger.warn(`⏭️ Migration #${migrationId} already executed, skipping`);
            }
        }
        
        syncLogger.info('✅ All migrations completed successfully');
    }

    // Откатывает миграции до указанной версии
    async rollback(targetVersion: number = 0): Promise<void> {
        const executedMigrations = await this.getExecutedMigrations();
        
        // Откатываем в обратном порядке
        for (const migration of executedMigrations.reverse()) {
            if (migration.id <= targetVersion) break;
            
            syncLogger.info(`🔄 Rolling back migration #${migration.id}...`);
            
            try {
                await migrationsRegistry[migration.id].down(this.queryInterface);
                await this.removeMigrationRecord(migration.id);
                syncLogger.info(`✅ Migration #${migration.id} rolled back successfully`);
            } catch (error) {
                syncLogger.error(`❌ Rollback of migration #${migration.id} failed:`, error);
                throw error;
            }
        }
        
        syncLogger.info('✅ Rollback completed successfully');
    }

    // Показывает статус миграций
    async status(): Promise<void> {
        const executedMigrations = await this.getExecutedMigrations();
        const executedIds = new Set(executedMigrations.map(m => m.id));
        const migrationIds = Object.keys(migrationsRegistry).map(Number).sort((a, b) => a - b);
        
        syncLogger.info('\n📊 Migration Status:');
        syncLogger.info('===================');
        
        for (const migrationId of migrationIds) {
            const status = executedIds.has(migrationId) ? '✅ EXECUTED' : '⏳ PENDING';
           syncLogger.info(`#${migrationId}: ${status}`);
        }
        
        if (executedMigrations.length === migrationIds.length) {
           syncLogger.info('\n🎉 All migrations are up to date!');
        } else {
            syncLogger.info(`\n📈 ${migrationIds.length - executedMigrations.length} migration(s) pending`);
        }
    }
}

// Экспорт миграций для runner
export const migrations = migrationsRegistry;

export { Migration, MigrationRecord, MigrationManagerOptions };