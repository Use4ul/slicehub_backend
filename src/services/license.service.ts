import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { License } from "../../db/sequelize/models/License";

/**
 * Сервис для работы с лицензиями
 */
export class LicenseService extends BaseService<License> {
	constructor() {
		super(Models.License);
	}

	/**
	 * Найти лицензию по названию
	 */
	async findByName(name: string): Promise<License | null> {
		return await this.findOne({
			where: { name }
		});
	}
}

// Экспортируем singleton instance
export const licenseService = new LicenseService();

