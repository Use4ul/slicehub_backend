import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { LicenseModel } from "../../db/sequelize/models/LicenseModel";

/**
 * Сервис для работы с лицензиями моделей
 */
export class ModelLicenseService extends BaseService<LicenseModel> {
	constructor() {
		super(Models.LicenseModel);
	}

	/**
	 * Получить лицензии модели
	 */
	async findByModel(modelId: number): Promise<LicenseModel[]> {
		return await this.findAll({
			where: { model_id: modelId }
		});
	}

	/**
	 * Получить модели с определенной лицензией
	 */
	async findByLicense(licenseId: number): Promise<LicenseModel[]> {
		return await this.findAll({
			where: { license_id: licenseId }
		});
	}
}

// Экспортируем singleton instance
export const modelLicenseService = new ModelLicenseService();

