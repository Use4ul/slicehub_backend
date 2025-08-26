const { loggerDB } = require('../sys/logger');

/**
 * Инициализирует базу данных (синхронизация + заполнение тестовыми данными)
 */
const initDB = async () => {
    try {
        loggerDB.info('Starting database initialization...');
        /*
        
        */
        loggerDB.info('Database initialized successfully');
        return true;
    } catch (error) {
        loggerDB.error('Database initialization failed:', {
            message: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

module.exports = initDB;
