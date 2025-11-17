import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { FileModel } from "../../db/sequelize/models/FileModel";

/**
 * Сервис для работы с файлами моделей
 */
export class ModelFileService extends BaseService<FileModel> {
	constructor() {
		super(Models.FileModel);
	}

	/**
	 * Получить файлы по модели
	 */
	async findByModel(modelId: number): Promise<FileModel[]> {
		return await this.findAll({
			where: { model_id: modelId }
		});
	}

	/**
	 * Получить файлы по типу
	 */
	async findByFileType(fileTypeId: number): Promise<FileModel[]> {
		return await this.findAll({
			where: { file_type_id: fileTypeId }
		});
	}
}

// Экспортируем singleton instance
export const modelFileService = new ModelFileService();

