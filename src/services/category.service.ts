import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { CategoryModel } from "../../db/sequelize/models/CategoryModel";

/**
 * Сервис для работы с категориями
 */
export class CategoryService extends BaseService<CategoryModel> {
	constructor() {
		super(Models.CategoryModel);
	}

	/**
	 * Найти категорию по slug
	 */
	async findBySlug(slug: string): Promise<CategoryModel | null> {
		return await this.findOne({
			where: { slug }
		});
	}

	/**
	 * Получить категории по родительской категории
	 */
	async findByParent(parentId: number): Promise<CategoryModel[]> {
		return await this.findAll({
			where: { parent_id: parentId }
		});
	}

	/**
	 * Получить корневые категории (без родителя)
	 */
	async findRootCategories(): Promise<CategoryModel[]> {
		return await this.findAll({
			where: { parent_id: null }
		});
	}
}

// Экспортируем singleton instance
export const categoryService = new CategoryService();

