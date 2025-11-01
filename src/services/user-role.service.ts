import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { UserRole } from "../../db/sequelize/models/UserRole";

/**
 * Сервис для работы с ролями пользователей
 */
export class UserRoleService extends BaseService<UserRole> {
	constructor() {
		super(Models.UserRole);
	}

	/**
	 * Получить роли пользователя
	 */
	async findByUser(userId: string): Promise<UserRole[]> {
		return await this.findAll({
			where: { user_id: userId }
		});
	}

	/**
	 * Получить пользователей с определенной ролью
	 */
	async findByRole(roleId: number): Promise<UserRole[]> {
		return await this.findAll({
			where: { role_id: roleId }
		});
	}

	/**
	 * Проверить, есть ли у пользователя роль
	 */
	async userHasRole(userId: string, roleId: number): Promise<boolean> {
		const count = await this.model.count({
			where: { user_id: userId, role_id: roleId }
		});
		return count > 0;
	}

	/**
	 * Назначить роль пользователю (если еще не назначена)
	 */
	async assignRole(userId: string, roleId: number): Promise<UserRole> {
		const existing = await this.findOne({
			where: { user_id: userId, role_id: roleId }
		});

		if (existing) {
			return existing;
		}

		return await this.create({ user_id: userId, role_id: roleId });
	}

	/**
	 * Удалить роль у пользователя
	 */
	async removeRole(userId: string, roleId: number): Promise<boolean> {
		const record = await this.findOne({
			where: { user_id: userId, role_id: roleId }
		});

		if (!record) return false;

		await record.destroy();
		return true;
	}
}

// Экспортируем singleton instance
export const userRoleService = new UserRoleService();

