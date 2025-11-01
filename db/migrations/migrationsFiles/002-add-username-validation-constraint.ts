import { QueryInterface } from 'sequelize';
import { syncLogger } from '../../../sys/logger';
import { EMOJI } from '../../../src/utils/emojis';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.MIGRATION} Running migration: add username validation constraint`);
    
    // Добавляем CHECK constraint для user_name
    // - Только латиница, цифры и подчеркивание
    // - Длина от 3 до 32 символов
    await queryInterface.sequelize.query(`
        ALTER TABLE users 
        ADD CONSTRAINT users_user_name_format_check 
        CHECK (
            user_name ~ '^[a-zA-Z0-9_]{3,32}$'
        );
    `);
    
    syncLogger.info(`${EMOJI.SUCCESS} add username validation constraint migration completed successfully`);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.ROLLBACK} Reverting migration: add username validation constraint`);
    
    // Удаляем CHECK constraint
    await queryInterface.sequelize.query(`
        ALTER TABLE users 
        DROP CONSTRAINT IF EXISTS users_user_name_format_check;
    `);
    
    syncLogger.info(`${EMOJI.SUCCESS} add username validation constraint migration reverted successfully`);
};

export default { up, down };
