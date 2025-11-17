import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { ThreeDModel } from "../../db/sequelize/models/ThreeDModel";

/**
 * Сервис для работы с 3D моделями
 */
export class Model3dService extends BaseService<ThreeDModel> {
	constructor() {
		super(Models.ThreeDModel);
	}

	/**
	 * Получить модели по пользователю
	 */
	async findByUser(userId: string): Promise<ThreeDModel[]> {
		return await this.findAll({
			where: { user_id: userId }
		});
	}

	/**
	 * Получить модели по категории
	 */
	async findByCategory(categoryId: number): Promise<ThreeDModel[]> {
		return await this.findAll({
			where: { category_id: categoryId }
		});
	}

	/**
	 * Получить модели по slug
	 */
	async findBySlug(slug: string): Promise<ThreeDModel | null> {
		return await this.findOne({
			where: { slug }
		});
	}

	/**
	 * Поиск моделей по названию (частичное совпадение)
	 */
	async searchByTitle(searchTerm: string): Promise<ThreeDModel[]> {
		const { Op } = require("sequelize");
		return await this.findAll({
			where: {
				title: {
					[Op.iLike]: `%${searchTerm}%`
				}
			}
		});
	}
}

// Экспортируем singleton instance
export const model3dService = new Model3dService();

