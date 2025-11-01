import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { Role } from "../../db/sequelize/models/Role";

/**
 * Сервис для работы с ролями
 */
export class RoleService extends BaseService<Role> {
	constructor() {
		super(Models.Role);
	}

	/**
	 * Найти роль по названию
	 */
	async findByName(name: string): Promise<Role | null> {
		return await this.findOne({
			where: { name }
		});
	}
}

// Экспортируем singleton instance
export const roleService = new RoleService();

