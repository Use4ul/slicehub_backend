import conf from '../../conf.json';
import path from 'path';
import fs from 'fs';
import { Sequelize, DataTypes } from 'sequelize';
import { loggerDB } from '../../sys/logger';
import { Configuration } from '../../src/types/config';

const config = conf as unknown as Configuration;

// Проверки конфигурации
if (!config.DB || !config.auth) {
    throw new Error('Database configuration is missing in conf.json');
}

const dbName = config.settings.database;
if (!dbName) throw new Error('Database name not specified in settings.database');

const dbSettings = config.DB[dbName];
if (!dbSettings) throw new Error(`Database settings for ${dbName} not found in config.DB`);

const auth = config.auth[dbSettings.user];
if (!auth) throw new Error(`Auth settings for user ${dbSettings.user} not found in config.auth`);

// Инициализация Sequelize
const dbConnection = new Sequelize(dbSettings.database, auth.login, auth.password, {
    host: dbSettings.host,
    port: typeof dbSettings.port === 'string' ? parseInt(dbSettings.port) : dbSettings.port,
    dialect: dbSettings.dialect as 'postgres' | 'mysql' | 'sqlite' | 'mssql',
    logging: dbSettings.logging ? (sql: string, timing?: number) => {
        loggerDB.debug(`[SQL] ${sql} | ${timing}ms`);
    } : false,
    benchmark: dbSettings.benchmark,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

// Автоматический импорт моделей
const models: { [key: string]: any } = {};
const modelsPath = path.join(__dirname, './models');

if (fs.existsSync(modelsPath)) {
    fs.readdirSync(modelsPath)
        .filter((file) => 
            (file.endsWith('.ts') || file.endsWith('.js')) && 
            !file.endsWith('.d.ts') && 
            file !== 'index.ts' && 
            file !== 'index.js'
        )
        .forEach((file) => {
            try {
                const modelName = path.basename(file, path.extname(file));
                const modelPath = path.join(modelsPath, file);
                const modelModule = require(modelPath);
                
                // Для моделей с классом и методом initialize
                const ModelClass = modelModule.default || modelModule;
                if (ModelClass && typeof ModelClass.initialize === 'function') {
                    const model = ModelClass.initialize(dbConnection);
                    models[modelName] = model;
                }
            } catch (error) {
                loggerDB.error(`Error loading model ${file}:`, error);
            }
        });
}

// Установка ассоциаций
Object.values(models).forEach((model) => {
    if (model.associate && typeof model.associate === 'function') {
        model.associate(models);
    }
});

// Функция для проверки подключения
export const authenticateDB = async (): Promise<void> => {
    try {
        await dbConnection.authenticate();
        loggerDB.info('Database connection established successfully.');
    } catch (error) {
        loggerDB.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

// Экспортируем модели и соединение
export { models, dbConnection, DataTypes };
export default models;