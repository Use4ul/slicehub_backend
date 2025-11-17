import { dbConnection } from "./index";
import { loggerDB } from "../../sys/logger";
import conf from "../../conf.json";
import { Configuration } from "../../config/config";
import { QueryTypes } from "sequelize";

const config = conf as unknown as Configuration;

/**
 * Создает схему в базе данных, если она указана в конфигурации и еще не существует
 */
export const ensureSchema = async (): Promise<void> => {
    const dbName = config.settings.database;
    const dbSettings = config.db[dbName];
    
    if (!dbSettings.schema) {
        loggerDB.debug("Schema not configured, using default");
        return;
    }

    const schemaName = dbSettings.schema;

    try {
        // Проверяем существование схемы
        const results = await dbConnection.query<{ schema_name: string }>(
            `SELECT schema_name FROM information_schema.schemata WHERE schema_name = :schema`,
            {
                replacements: { schema: schemaName },
                type: QueryTypes.SELECT
            }
        );

        if (results.length === 0) {
            // Схема не существует - создаем
            loggerDB.info(`Creating schema "${schemaName}"...`);
            await dbConnection.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
            loggerDB.info(`Schema "${schemaName}" created successfully`);
        } else {
            loggerDB.debug(`Schema "${schemaName}" already exists`);
        }
    } catch (error) {
        loggerDB.error(`Failed to ensure schema "${schemaName}":`, error);
        throw error;
    }
};

export default ensureSchema;

