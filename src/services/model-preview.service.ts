import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { PreviewModel } from "../../db/sequelize/models/PreviewModel";

/**
 * Сервис для работы с превью моделей
 */
export class ModelPreviewService extends BaseService<PreviewModel> {
	constructor() {
		super(Models.PreviewModel);
	}

	/**
	 * Получить превью по модели
	 */
	async findByModel(modelId: number): Promise<PreviewModel[]> {
		return await this.findAll({
			where: { model_id: modelId },
			order: [['preview_order', 'ASC']]
		});
	}

	/**
	 * Получить главное превью модели
	 */
	async findMainPreview(modelId: number): Promise<PreviewModel | null> {
		return await this.findOne({
			where: { model_id: modelId, preview_order: 1 }
		});
	}
}

// Экспортируем singleton instance
export const modelPreviewService = new ModelPreviewService();

