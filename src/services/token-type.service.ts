import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { TokenType } from "../../db/sequelize/models/TokenType";

/**
 * Сервис для работы с типами токенов
 */
export class TokenTypeService extends BaseService<TokenType> {
	constructor() {
		super(Models.TokenType);
	}

	/**
	 * Найти тип токена по названию
	 */
	async findByName(name: string): Promise<TokenType | null> {
		return await this.findOne({
			where: { name }
		});
	}
}

// Экспортируем singleton instance
export const tokenTypeService = new TokenTypeService();

