import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { ModelCategory } from "../../db/sequelize/models/ModelCategory";

/**
 * Сервис для работы с категориями
 */
export class CategoryService extends BaseService<ModelCategory> {
	constructor() {
		super(Models.ModelCategory);
	}

	/**
	 * Найти категорию по slug
	 */
	async findBySlug(slug: string): Promise<ModelCategory | null> {
		return await this.findOne({
			where: { slug }
		});
	}

	/**
	 * Получить категории по родительской категории
	 */
	async findByParent(parentId: number): Promise<ModelCategory[]> {
		return await this.findAll({
			where: { parent_id: parentId }
		});
	}

	/**
	 * Получить корневые категории (без родителя)
	 */
	async findRootCategories(): Promise<ModelCategory[]> {
		return await this.findAll({
			where: { parent_id: null }
		});
	}
}

// Экспортируем singleton instance
export const categoryService = new CategoryService();

