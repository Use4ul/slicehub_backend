import conf from '../../conf.json';
import path from 'path';
import { Sequelize, DataTypes, ModelStatic, Model } from 'sequelize';
import { loggerDB } from '../../sys/logger';
import { Configuration } from '../../src/types/config';

// Безопасное преобразование с проверкой
const config = conf as unknown as Configuration;

// Проверяем наличие необходимых конфигураций
if (!config.DB || !config.auth) {
    throw new Error('Database configuration is missing in conf.json');
}

const dbName = config.settings.database;
if (!dbName) {
    throw new Error('Database name not specified in settings.database');
}

const dbSettings = config.DB[dbName];
if (!dbSettings) {
    throw new Error(`Database settings for ${dbName} not found in config.DB`);
}

const auth = config.auth[dbSettings.user];
if (!auth) {
    throw new Error(`Auth settings for user ${dbSettings.user} not found in config.auth`);
}

// Инициализация Sequelize
export const dbConnection = new Sequelize(dbSettings.database, auth.login, auth.password, {
    host: dbSettings.host,
    port: typeof dbSettings.port === 'string' ? parseInt(dbSettings.port) : dbSettings.port,
    dialect: dbSettings.dialect as 'postgres' | 'mysql' | 'sqlite' | 'mssql',
    logging: dbSettings.logging
        ? (sql: string, timing?: number) => {
              loggerDB.debug(`[SQL] ${sql} | ${timing}ms`);
          }
        : false,
    benchmark: dbSettings.benchmark,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

// Автоматический импорт моделей
const Models: { [key: string]: ModelStatic<Model> } = {};
const modelsPath = path.join(__dirname, './models');

import fs from 'fs';

if (fs.existsSync(modelsPath)) {
    fs.readdirSync(modelsPath)
        .filter((file) => file.endsWith('.model.ts') || file.endsWith('.model.js'))
        .forEach((file) => {
            try {
                const modelPath = path.join(modelsPath, file);
                const modelModule = require(modelPath);
                const model = modelModule.default(dbConnection, DataTypes) as ModelStatic<Model>;
                Models[model.name] = model;
            } catch (error) {
                loggerDB.error(`Error loading model ${file}:`, error);
            }
        });
}

// Установка ассоциаций
Object.values(Models).forEach((model) => {
    if ('associate' in model && typeof (model as any).associate === 'function') {
        (model as any).associate(Models);
    }
});

// Проверка подключения
await (async (): Promise<void> => {
    try {
        await dbConnection.authenticate();
        loggerDB.info('Database connection established successfully.');
    } catch (error) {
        loggerDB.error('Unable to connect to the database:', error);
        process.exit(1);
    }
})();

export { Sequelize, DataTypes };
export default Models;
