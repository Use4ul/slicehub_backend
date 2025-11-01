import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { ModelLicense } from "../../db/sequelize/models/ModelLicense";

/**
 * Сервис для работы с лицензиями моделей
 */
export class ModelLicenseService extends BaseService<ModelLicense> {
	constructor() {
		super(Models.ModelLicense);
	}

	/**
	 * Получить лицензии модели
	 */
	async findByModel(modelId: number): Promise<ModelLicense[]> {
		return await this.findAll({
			where: { model_id: modelId }
		});
	}

	/**
	 * Получить модели с определенной лицензией
	 */
	async findByLicense(licenseId: number): Promise<ModelLicense[]> {
		return await this.findAll({
			where: { license_id: licenseId }
		});
	}
}

// Экспортируем singleton instance
export const modelLicenseService = new ModelLicenseService();

