import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { Model3d } from "../../db/sequelize/models/Model3d";

/**
 * Сервис для работы с 3D моделями
 */
export class Model3dService extends BaseService<Model3d> {
	constructor() {
		super(Models.Model3d);
	}

	/**
	 * Получить модели по пользователю
	 */
	async findByUser(userId: string): Promise<Model3d[]> {
		return await this.findAll({
			where: { user_id: userId }
		});
	}

	/**
	 * Получить модели по категории
	 */
	async findByCategory(categoryId: number): Promise<Model3d[]> {
		return await this.findAll({
			where: { category_id: categoryId }
		});
	}

	/**
	 * Получить модели по slug
	 */
	async findBySlug(slug: string): Promise<Model3d | null> {
		return await this.findOne({
			where: { slug }
		});
	}

	/**
	 * Поиск моделей по названию (частичное совпадение)
	 */
	async searchByTitle(searchTerm: string): Promise<Model3d[]> {
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

