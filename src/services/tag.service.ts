import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { Tag } from "../../db/sequelize/models/Tag";

/**
 * Сервис для работы с тегами
 */
export class TagService extends BaseService<Tag> {
	constructor() {
		super(Models.Tag);
	}

	/**
	 * Найти тег по имени
	 */
	async findByName(name: string): Promise<Tag | null> {
		return await this.findOne({
			where: { name }
		});
	}

	/**
	 * Проверить существование тега
	 */
	async tagExists(name: string): Promise<boolean> {
		const count = await this.model.count({
			where: { name }
		});
		return count > 0;
	}
}

// Экспортируем singleton instance
export const tagService = new TagService();

