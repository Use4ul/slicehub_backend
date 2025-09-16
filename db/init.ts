import { loggerDB } from '../sys/logger';

/**
 * Инициализирует базу данных (синхронизация + заполнение тестовыми данными)
 */
export const initDB = async (): Promise<boolean> => {
    try {
        loggerDB.info('Starting database initialization...');
        /*
        
        */
        loggerDB.info('Database initialized successfully');
        return true;
    } catch (error) {
        loggerDB.error('Database initialization failed:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        throw error;
    }
};

export default initDB;
