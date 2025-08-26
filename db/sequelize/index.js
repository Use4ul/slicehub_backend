const conf = require('../../conf.json');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { loggerDB } = require('../../sys/logger');

const db = conf?.settings?.database;
const dbSettings = conf?.DB[db];
const auth = conf?.auth[`${dbSettings.user}`];

// Инициализация Sequelize
const dbConnection = new Sequelize(dbSettings?.database, auth?.login, auth?.password, {
    host: dbSettings.host,
    port: dbSettings.port,
    dialect: dbSettings.dialect,
    logging: dbSettings.logging
        ? (sql, timing) => {
              loggerDB.debug(`[SQL] ${sql} | ${timing}ms`);
          }
        : false,
    benchmark: true,
    pool: 'tcp',
});

// Автоматический импорт моделей
const Models = {};
const modelsPath = path.join(__dirname, './models');

require('fs')
    .readdirSync(modelsPath)
    .filter((file) => file.endsWith('.model.js'))
    .forEach((file) => {
        const model = require(path.join(modelsPath, file))(dbConnection, DataTypes);
        Models[model.name] = model;
    });

// Установка ассоциаций
Object.values(Models).forEach((model) => {
    if (model.associate) {
        model.associate(Models);
    }
});

// Проверка подключения
(async () => {
    try {
        await dbConnection.authenticate();
        loggerDB.info('Database connection established successfully.');
    } catch (error) {
        loggerDB.error('Unable to connect to the database:', error);
        process.exit(1);
    }
})();

module.exports = {
    Sequelize,
    dbConnection,
    ...Models,
};
