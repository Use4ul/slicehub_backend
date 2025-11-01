import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { ModelFile } from "../../db/sequelize/models/ModelFile";

/**
 * Сервис для работы с файлами моделей
 */
export class ModelFileService extends BaseService<ModelFile> {
	constructor() {
		super(Models.ModelFile);
	}

	/**
	 * Получить файлы по модели
	 */
	async findByModel(modelId: number): Promise<ModelFile[]> {
		return await this.findAll({
			where: { model_id: modelId }
		});
	}

	/**
	 * Получить файлы по типу
	 */
	async findByFileType(fileTypeId: number): Promise<ModelFile[]> {
		return await this.findAll({
			where: { file_type_id: fileTypeId }
		});
	}
}

// Экспортируем singleton instance
export const modelFileService = new ModelFileService();

