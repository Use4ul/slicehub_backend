import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { CollectionItem } from "../../db/sequelize/models/CollectionItem";

/**
 * Сервис для работы с элементами коллекций
 */
export class CollectionItemService extends BaseService<CollectionItem> {
	constructor() {
		super(Models.CollectionItem);
	}

	/**
	 * Получить элементы коллекции
	 */
	async findByCollection(collectionId: number): Promise<CollectionItem[]> {
		return await this.findAll({
			where: { collection_id: collectionId },
			order: [['created_at', 'DESC']]
		});
	}

	/**
	 * Проверить, есть ли модель в коллекции
	 */
	async isModelInCollection(collectionId: string, modelId: string): Promise<boolean> {
		const count = await this.model.count({
			where: { collection_id: collectionId, model_id: modelId }
		});
		return count > 0;
	}

	/**
	 * Добавить модель в коллекцию (если еще не добавлена)
	 */
	async addModelToCollection(collectionId: string, modelId: string): Promise<CollectionItem> {
		const existing = await this.findOne({
			where: { collection_id: collectionId, model_id: modelId }
		});

		if (existing) {
			return existing;
		}

		return await this.create({ collection_id: collectionId, model_id: modelId });
	}

	/**
	 * Удалить модель из коллекции
	 */
	async removeModelFromCollection(collectionId: string, modelId: string): Promise<boolean> {
		const record = await this.findOne({
			where: { collection_id: collectionId, model_id: modelId }
		});

		if (!record) return false;

		await record.destroy();
		return true;
	}

	/**
	 * Получить коллекции, содержащие модель
	 */
	async findCollectionsByModel(modelId: string): Promise<CollectionItem[]> {
		return await this.findAll({
			where: { model_id: modelId }
		});
	}
}

// Экспортируем singleton instance
export const collectionItemService = new CollectionItemService();

