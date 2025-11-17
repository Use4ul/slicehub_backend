import { QueryInterface } from 'sequelize';
import { syncLogger } from '../../../sys/logger';
import { EMOJI } from '../../../src/utils/emojis';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.MIGRATION} Running migration: Rename model tables`);

    // Переименовываем таблицы чтобы слово "model" было в конце
    await queryInterface.renameTable('models_3d', 'three_d_models');
    await queryInterface.renameTable('model_categories', 'categories_model');
    await queryInterface.renameTable('model_comments', 'comments_model');
    await queryInterface.renameTable('model_files', 'files_model');
    await queryInterface.renameTable('model_licenses', 'licenses_model');
    await queryInterface.renameTable('model_previews', 'previews_model');
    await queryInterface.renameTable('model_ratings', 'ratings_model');
    await queryInterface.renameTable('model_tags', 'tags_model');

    syncLogger.info(`${EMOJI.SUCCESS} Model tables renamed successfully`);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(`${EMOJI.ROLLBACK} Reverting migration: Rename model tables back`);

    // Возвращаем старые названия таблиц
    await queryInterface.renameTable('three_d_models', 'models_3d');
    await queryInterface.renameTable('categories_model', 'model_categories');
    await queryInterface.renameTable('comments_model', 'model_comments');
    await queryInterface.renameTable('files_model', 'model_files');
    await queryInterface.renameTable('licenses_model', 'model_licenses');
    await queryInterface.renameTable('previews_model', 'model_previews');
    await queryInterface.renameTable('ratings_model', 'model_ratings');
    await queryInterface.renameTable('tags_model', 'model_tags');

    syncLogger.info(`${EMOJI.SUCCESS} Model tables renamed back successfully`);
};

export default { up, down };

