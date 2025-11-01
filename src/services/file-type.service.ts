import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { FileType } from "../../db/sequelize/models/FileType";

/**
 * Сервис для работы с типами файлов
 */
export class FileTypeService extends BaseService<FileType> {
	constructor() {
		super(Models.FileType);
	}

	/**
	 * Найти тип файла по расширению
	 */
	async findByExtension(extension: string): Promise<FileType | null> {
		return await this.findOne({
			where: { extension }
		});
	}
}

// Экспортируем singleton instance
export const fileTypeService = new FileTypeService();

