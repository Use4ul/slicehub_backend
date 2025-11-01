import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { AuthIdentity } from "../../db/sequelize/models/AuthIdentity";

/**
 * Сервис для работы с аутентификационными идентификаторами
 */
export class AuthIdentityService extends BaseService<AuthIdentity> {
	constructor() {
		super(Models.AuthIdentity);
	}

	/**
	 * Получить идентификаторы пользователя
	 */
	async findByUser(userId: string): Promise<AuthIdentity[]> {
		return await this.findAll({
			where: { user_id: userId }
		});
	}

	/**
	 * Найти идентификатор по провайдеру и внешнему ID
	 */
	async findByProviderAndExternalId(providerId: number, providerUserId: string): Promise<AuthIdentity | null> {
		return await this.findOne({
			where: { 
				provider_id: providerId,
				provider_user_id: providerUserId
			}
		});
	}

	/**
	 * Получить идентификаторы по провайдеру
	 */
	async findByProvider(providerId: number): Promise<AuthIdentity[]> {
		return await this.findAll({
			where: { provider_id: providerId }
		});
	}
}

// Экспортируем singleton instance
export const authIdentityService = new AuthIdentityService();

