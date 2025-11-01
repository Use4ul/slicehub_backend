import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { AuthProvider } from "../../db/sequelize/models/AuthProvider";

/**
 * Сервис для работы с провайдерами аутентификации
 */
export class AuthProviderService extends BaseService<AuthProvider> {
	constructor() {
		super(Models.AuthProvider);
	}

	/**
	 * Найти провайдер по названию
	 */
	async findByName(name: string): Promise<AuthProvider | null> {
		return await this.findOne({
			where: { name }
		});
	}
}

// Экспортируем singleton instance
export const authProviderService = new AuthProviderService();

