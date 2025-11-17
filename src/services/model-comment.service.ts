import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { CommentModel } from "../../db/sequelize/models/CommentModel";

/**
 * Сервис для работы с комментариями моделей
 */
export class ModelCommentService extends BaseService<CommentModel> {
	constructor() {
		super(Models.CommentModel);
	}

	/**
	 * Получить комментарии модели
	 */
	async findByModel(modelId: string): Promise<CommentModel[]> {
		return await this.findAll({
			where: { model_id: modelId },
			order: [['created_at', 'DESC']]
		});
	}

	/**
	 * Получить комментарии пользователя
	 */
	async findByUser(userId: string): Promise<CommentModel[]> {
		return await this.findAll({
			where: { user_id: userId },
			order: [['created_at', 'DESC']]
		});
	}

	/**
	 * Получить дочерние комментарии (ответы)
	 */
	async findReplies(parentCommentId: number): Promise<CommentModel[]> {
		return await this.findAll({
			where: { parent_comment_id: parentCommentId },
			order: [['created_at', 'ASC']]
		});
	}
}

// Экспортируем singleton instance
export const modelCommentService = new ModelCommentService();

