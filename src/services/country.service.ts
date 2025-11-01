import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { Country } from "../../db/sequelize/models/Country";

/**
 * Сервис для работы со странами
 */
export class CountryService extends BaseService<Country> {
	constructor() {
		super(Models.Country);
	}

	/**
	 * Найти страну по ISO коду
	 */
	async findByIsoCode(isoCode: string): Promise<Country | null> {
		return await this.findOne({
			where: { iso_code: isoCode }
		});
	}

	/**
	 * Найти страну по названию
	 */
	async findByName(name: string): Promise<Country | null> {
		return await this.findOne({
			where: { name }
		});
	}
}

// Экспортируем singleton instance
export const countryService = new CountryService();

