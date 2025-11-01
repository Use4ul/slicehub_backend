import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { UserStatus } from "../../db/sequelize/models/UserStatus";

/**
 * Сервис для работы со статусами пользователей
 */
export class UserStatusService extends BaseService<UserStatus> {
	constructor() {
		super(Models.UserStatus);
	}

	/**
	 * Найти статус по названию
	 */
	async findByName(name: string): Promise<UserStatus | null> {
		return await this.findOne({
			where: { name }
		});
	}
}

// Экспортируем singleton instance
export const userStatusService = new UserStatusService();

