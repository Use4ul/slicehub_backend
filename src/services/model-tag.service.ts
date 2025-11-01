import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { ModelTag } from "../../db/sequelize/models/ModelTag";

/**
 * Сервис для работы с тегами моделей
 */
export class ModelTagService extends BaseService<ModelTag> {
	constructor() {
		super(Models.ModelTag);
	}

	/**
	 * Получить теги модели
	 */
	async findByModel(modelId: number): Promise<ModelTag[]> {
		return await this.findAll({
			where: { model_id: modelId }
		});
	}

	/**
	 * Получить модели с определенным тегом
	 */
	async findByTag(tagId: number): Promise<ModelTag[]> {
		return await this.findAll({
			where: { tag_id: tagId }
		});
	}

	/**
	 * Добавить тег к модели (если еще не добавлен)
	 */
	async addTagToModel(modelId: string, tagId: number): Promise<ModelTag> {
		const existing = await this.findOne({
			where: { model_id: modelId, tag_id: tagId }
		});

		if (existing) {
			return existing;
		}

		return await this.create({ model_id: modelId, tag_id: tagId });
	}

	/**
	 * Удалить тег у модели
	 */
	async removeTagFromModel(modelId: number, tagId: number): Promise<boolean> {
		const record = await this.findOne({
			where: { model_id: modelId, tag_id: tagId }
		});

		if (!record) return false;

		await record.destroy();
		return true;
	}
}

// Экспортируем singleton instance
export const modelTagService = new ModelTagService();

