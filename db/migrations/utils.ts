import conf from '../../conf.json';
import { Configuration } from '../../config/config';

const config = conf as unknown as Configuration;

/**
 * Получает префикс схемы для SQL запросов в миграциях
 * Возвращает "schema_name". если схема указана, иначе пустую строку
 */
export function getSchemaPrefix(): string {
    const dbName = config.settings.database;
    const dbSettings = config.db[dbName];
    return dbSettings.schema ? `"${dbSettings.schema}".` : '';
}

