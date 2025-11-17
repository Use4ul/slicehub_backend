import { QueryInterface } from 'sequelize';
import { syncLogger } from '../../../sys/logger';
import { EMOJI } from '../../../src/utils/emojis';
import { getSchemaPrefix } from '../utils';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.MIGRATION} Running migration: Create case-insensitive indexes`);

    const schemaPrefix = getSchemaPrefix();

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS countries_name_ci_idx 
        ON ${schemaPrefix}"countries" (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS cities_name_ci_idx
        ON ${schemaPrefix}"cities" (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS tags_name_ci_idx 
        ON ${schemaPrefix}"tags" (LOWER(name));
    `);
    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_ci_idx 
        ON ${schemaPrefix}"tags" (LOWER(slug));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS categories_model_name_ci_idx 
        ON ${schemaPrefix}"categories_model" (LOWER(name));
    `);
    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS categories_model_slug_ci_idx 
        ON ${schemaPrefix}"categories_model" (LOWER(slug));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS three_d_models_slug_ci_idx 
        ON ${schemaPrefix}"three_d_models" (LOWER(slug));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS auth_providers_name_ci_idx 
        ON ${schemaPrefix}"auth_providers" (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS roles_name_ci_idx 
        ON ${schemaPrefix}"roles" (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS user_statuses_name_ci_idx 
        ON ${schemaPrefix}"user_statuses" (LOWER(name));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS file_types_extension_ci_idx 
        ON ${schemaPrefix}"file_types" (LOWER(extension));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS profiles_contact_email_ci_idx 
        ON ${schemaPrefix}"profiles" (LOWER(contact_email));
    `);

    await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS token_types_name_ci_idx 
        ON ${schemaPrefix}"token_types" (LOWER(name));
    `);

    syncLogger.info(`${EMOJI.SUCCESS} Case-insensitive indexes created successfully`);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.ROLLBACK} Reverting migration: Drop case-insensitive indexes`);

    const schemaPrefix = getSchemaPrefix();

    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}countries_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}cities_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}tags_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}tags_slug_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}categories_model_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}categories_model_slug_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}three_d_models_slug_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}auth_providers_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}roles_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}user_statuses_name_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}file_types_extension_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}profiles_contact_email_ci_idx;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${schemaPrefix}token_types_name_ci_idx;`);

    syncLogger.info(`${EMOJI.SUCCESS} Case-insensitive indexes dropped successfully`);
};

export default { up, down };
