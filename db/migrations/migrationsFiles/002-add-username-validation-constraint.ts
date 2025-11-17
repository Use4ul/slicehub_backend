import { QueryInterface } from 'sequelize';
import { syncLogger } from '../../../sys/logger';
import { EMOJI } from '../../../src/utils/emojis';
import { getSchemaPrefix } from '../utils';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.MIGRATION} Running migration: add username validation constraint`);
    
    const schemaPrefix = getSchemaPrefix();
    
    // Добавляем CHECK constraint для user_name
    // - Только латиница, цифры и подчеркивание
    // - Длина от 3 до 32 символов
    await queryInterface.sequelize.query(`
        ALTER TABLE ${schemaPrefix}"users" 
        ADD CONSTRAINT users_user_name_format_check 
        CHECK (
            user_name ~ '^[a-zA-Z0-9_]{3,32}$'
        );
    `);
    
    syncLogger.info(`${EMOJI.SUCCESS} add username validation constraint migration completed successfully`);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.ROLLBACK} Reverting migration: add username validation constraint`);
    
    const schemaPrefix = getSchemaPrefix();
    
    // Удаляем CHECK constraint
    await queryInterface.sequelize.query(`
        ALTER TABLE ${schemaPrefix}"users" 
        DROP CONSTRAINT IF EXISTS users_user_name_format_check;
    `);
    
    syncLogger.info(`${EMOJI.SUCCESS} add username validation constraint migration reverted successfully`);
};

export default { up, down };
