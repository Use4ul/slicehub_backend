import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { City } from "../../db/sequelize/models/City";

/**
 * Сервис для работы с городами
 */
export class CityService extends BaseService<City> {
	constructor() {
		super(Models.City);
	}

	/**
	 * Получить города по стране
	 */
	async findByCountry(countryId: number): Promise<City[]> {
		return await this.findAll({
			where: { country_id: countryId }
		});
	}

	/**
	 * Найти город по названию и стране
	 */
	async findByNameAndCountry(name: string, countryId: number): Promise<City | null> {
		return await this.findOne({
			where: { 
				name,
				country_id: countryId
			}
		});
	}
}

// Экспортируем singleton instance
export const cityService = new CityService();

