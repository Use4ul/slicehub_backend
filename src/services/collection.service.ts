import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { Collection } from "../../db/sequelize/models/Collection";

/**
 * Сервис для работы с коллекциями
 */
export class CollectionService extends BaseService<Collection> {
	constructor() {
		super(Models.Collection);
	}

	/**
	 * Получить коллекции пользователя
	 */
	async findByUser(userId: string): Promise<Collection[]> {
		return await this.findAll({
			where: { user_id: userId },
			order: [['created_at', 'DESC']]
		});
	}

	/**
	 * Найти коллекцию по названию и пользователю
	 */
	async findByNameAndUser(name: string, userId: string): Promise<Collection | null> {
		return await this.findOne({
			where: { name, user_id: userId }
		});
	}
}

// Экспортируем singleton instance
export const collectionService = new CollectionService();

