import conf from "../../conf.json";
import { Sequelize } from "sequelize";
import { loggerDB } from "../../sys/logger";
import { Configuration } from "../../config/config";
import { initializeModels } from "./models";

const config = conf as unknown as Configuration;

// Проверки конфигурации
if (!config.db || !config.auth) {
    throw new Error("Database configuration is missing in conf.json");
}

const dbName = config.settings.database;

if (!dbName) throw new Error("Database name not specified in settings.database");

const dbSettings = config.db[dbName];

if (!dbSettings) throw new Error(`Database settings for ${dbName} not found in config.DB`);

const auth = config.auth[dbSettings.user];

if (!auth) throw new Error(`Auth settings for user ${dbSettings.user} not found in config.auth`);

// Инициализация Sequelize
const dbConnection = new Sequelize(dbSettings.database, auth.login, auth.password, {
    host: dbSettings.host,
    port: typeof dbSettings.port === "string" ? parseInt(dbSettings.port) : dbSettings.port,
    dialect: dbSettings.dialect as "postgres",
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

const Models = initializeModels(dbConnection);

// Функция для проверки подключения
export const authenticateDB = async (): Promise<void> => {
    try {
        await dbConnection.authenticate();
        loggerDB.info("Database connection established successfully.");
    } catch (error) {
        loggerDB.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

export { dbConnection }; // коннектор для прямого SQL
export default Models;
