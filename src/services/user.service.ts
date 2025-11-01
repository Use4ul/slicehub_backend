import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { User } from "../../db/sequelize/models/User";

/**
 * Сервис для работы с пользователями
 */
export class UserService extends BaseService<User> {
	constructor() {
		super(Models.User);
	}

	/**
	 * Найти пользователя по username
	 */
	async findByUsername(username: string): Promise<User | null> {
		return await this.findOne({
			where: { user_name: username }
		});
	}

	/**
	 * Проверить существование username
	 */
	async usernameExists(username: string): Promise<boolean> {
		const count = await this.model.count({
			where: { user_name: username }
		});
		return count > 0;
	}

	/**
	 * Получить пользователей по статусу
	 */
	async findByStatus(statusId: number): Promise<User[]> {
		return await this.findAll({
			where: { status_id: statusId }
		});
	}
}

// Экспортируем singleton instance
export const userService = new UserService();

