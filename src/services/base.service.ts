import { Model, ModelStatic, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from "sequelize";

/**
 * Базовый сервис для CRUD операций
 * Предоставляет стандартные методы для работы с любой моделью
 */
export class BaseService<T extends Model> {
	protected model: ModelStatic<T>;

	constructor(model: ModelStatic<T>) {
		this.model = model;
	}

	/**
	 * Получить все записи
	 */
	async findAll(options?: FindOptions): Promise<T[]> {
		return await this.model.findAll(options);
	}

	/**
	 * Получить одну запись по ID
	 */
	async findById(id: string | number, options?: FindOptions): Promise<T | null> {
		return await this.model.findByPk(id, options);
	}

	/**
	 * Получить одну запись по условию
	 */
	async findOne(options: FindOptions): Promise<T | null> {
		return await this.model.findOne(options);
	}

	/**
	 * Создать новую запись
	 */
	async create(data: Partial<T["_creationAttributes"]>, options?: CreateOptions): Promise<T> {
		return await this.model.create(data as T["_creationAttributes"], options);
	}

	/**
	 * Обновить запись
	 */
	async update(
		id: string | number,
		data: Partial<T["_attributes"]>,
		options?: UpdateOptions
	): Promise<T | null> {
		const record = await this.findById(id);
		if (!record) return null;
		
		await record.update(data, options);
		return record;
	}

	/**
	 * Удалить запись
	 */
	async delete(id: string | number, options?: DestroyOptions): Promise<boolean> {
		const record = await this.findById(id);
		if (!record) return false;
		
		await record.destroy(options);
		return true;
	}

	/**
	 * Подсчитать количество записей
	 */
	async count(options?: FindOptions): Promise<number> {
		return await this.model.count(options);
	}

	/**
	 * Проверить существование записи
	 */
	async exists(id: string | number): Promise<boolean> {
		const record = await this.findById(id);
		return record !== null;
	}
}

