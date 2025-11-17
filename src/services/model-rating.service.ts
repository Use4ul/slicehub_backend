import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { RatingModel } from "../../db/sequelize/models/RatingModel";

/**
 * Сервис для работы с рейтингами моделей
 */
export class ModelRatingService extends BaseService<RatingModel> {
	constructor() {
		super(Models.RatingModel);
	}

	/**
	 * Получить рейтинги модели
	 */
	async findByModel(modelId: string): Promise<RatingModel[]> {
		return await this.findAll({
			where: { model_id: modelId }
		});
	}

	/**
	 * Получить рейтинг пользователя для модели
	 */
	async findUserRating(modelId: string, userId: string): Promise<RatingModel | null> {
		return await this.findOne({
			where: { model_id: modelId, user_id: userId }
		});
	}

	/**
	 * Получить средний рейтинг модели
	 */
	async getAverageRating(modelId: string): Promise<number> {
		const ratings = await this.findByModel(modelId);
		if (ratings.length === 0) return 0;

		const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
		return sum / ratings.length;
	}

	/**
	 * Получить рейтинги пользователя
	 */
	async findByUser(userId: string): Promise<RatingModel[]> {
		return await this.findAll({
			where: { user_id: userId }
		});
	}
}

// Экспортируем singleton instance
export const modelRatingService = new ModelRatingService();

