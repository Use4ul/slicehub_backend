import { syncLogger, loggerDB } from "../../sys/logger";
import { Configuration } from "../../config/config";
import { SyncOptions } from "sequelize";
import { dbConnection } from "./index";
import conf from "../../conf.json";

const config = conf as unknown as Configuration;

export const syncDatabase = async (options: SyncOptions = {}): Promise<boolean> => {
    const defaultOptions: SyncOptions = {
        alter: config.settings.sync?.alter,
        force: config.settings.sync?.force || false,
        logging: (sql: string, timing?: number) => {
            loggerDB.debug(`[SQL] ${sql} | ${timing}ms`);
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        syncLogger.info("Starting database sync with options:", finalOptions);
        await dbConnection.sync(finalOptions);
        syncLogger.info("Database synced successfully");
        return true;
    } catch (error) {
        syncLogger.warn("Database sync failed:", error);
        throw error;
    }
};

export default syncDatabase;
