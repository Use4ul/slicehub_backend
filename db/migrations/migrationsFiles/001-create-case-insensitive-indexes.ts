import { QueryInterface } from 'sequelize';
import { syncLogger } from '../../../sys/logger';
import { EMOJI } from '../../../src/utils/emojis';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.MIGRATION} Running migration: Create case-insensitive indexes`);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS countries_name_ci_idx 
        ON countries (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS cities_name_ci_idx
        ON cities (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS tags_name_ci_idx 
        ON tags (LOWER(name));
    `);
    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_ci_idx 
        ON tags (LOWER(slug));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS categories_model_name_ci_idx 
        ON categories_model (LOWER(name));
    `);
    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS categories_model_slug_ci_idx 
        ON categories_model (LOWER(slug));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS three_d_models_slug_ci_idx 
        ON three_d_models (LOWER(slug));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS auth_providers_name_ci_idx 
        ON auth_providers (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS roles_name_ci_idx 
        ON roles (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS user_statuses_name_ci_idx 
        ON user_statuses (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS file_types_extension_ci_idx 
        ON file_types (LOWER(extension));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS profiles_contact_email_ci_idx 
        ON profiles (LOWER(contact_email));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS token_types_name_ci_idx 
        ON token_types (LOWER(name));
    `);

    syncLogger.info(`${EMOJI.SUCCESS} Case-insensitive indexes created successfully`);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.ROLLBACK} Reverting migration: Drop case-insensitive indexes`);

    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS countries_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS cities_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS tags_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS tags_slug_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS categories_model_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS categories_model_slug_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS three_d_models_slug_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS auth_providers_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS roles_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS user_statuses_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS file_types_extension_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS profiles_contact_email_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS token_types_name_ci_idx;`);

    syncLogger.info(`${EMOJI.SUCCESS} Case-insensitive indexes dropped successfully`);
};

export default { up, down };
