import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { ModelPreview } from "../../db/sequelize/models/ModelPreview";

/**
 * Сервис для работы с превью моделей
 */
export class ModelPreviewService extends BaseService<ModelPreview> {
	constructor() {
		super(Models.ModelPreview);
	}

	/**
	 * Получить превью по модели
	 */
	async findByModel(modelId: number): Promise<ModelPreview[]> {
		return await this.findAll({
			where: { model_id: modelId },
			order: [['preview_order', 'ASC']]
		});
	}

	/**
	 * Получить главное превью модели
	 */
	async findMainPreview(modelId: number): Promise<ModelPreview | null> {
		return await this.findOne({
			where: { model_id: modelId, preview_order: 1 }
		});
	}
}

// Экспортируем singleton instance
export const modelPreviewService = new ModelPreviewService();

