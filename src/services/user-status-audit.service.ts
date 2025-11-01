import { BaseService } from "./base.service";
import Models from "../../db/sequelize";
import { UserStatusAudit } from "../../db/sequelize/models/UserStatusAudit";

/**
 * Сервис для работы с аудитом статусов пользователей
 */
export class UserStatusAuditService extends BaseService<UserStatusAudit> {
	constructor() {
		super(Models.UserStatusAudit);
	}

	/**
	 * Получить историю изменений статуса пользователя
	 */
	async findByUser(userId: string): Promise<UserStatusAudit[]> {
		return await this.findAll({
			where: { user_id: userId },
			order: [['changed_at', 'DESC']]
		});
	}

	/**
	 * Получить последнее изменение статуса пользователя
	 */
	async findLastStatusChange(userId: string): Promise<UserStatusAudit | null> {
		const records = await this.findByUser(userId);
		return records.length > 0 ? records[0] : null;
	}

	/**
	 * Создать запись об изменении статуса
	 */
	async logStatusChange(
		userId: string, 
		oldStatus: number | undefined, 
		newStatus: number, 
		reason: string,
		changedBy: string
	): Promise<UserStatusAudit> {
		return await this.create({
			user_id: userId,
			old: oldStatus,
			new: newStatus,
			reason: reason,
			changed_by: changedBy
		});
	}
}

// Экспортируем singleton instance
export const userStatusAuditService = new UserStatusAuditService();
