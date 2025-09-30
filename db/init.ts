import { loggerDB } from "../sys/logger";
import { authenticateDB } from "./sequelize";
import { syncDatabase } from "./sequelize/sync";
import { runMigrations } from "./migrations/runner";
import { seedDatabase } from "./sequelize/seeds";

export async function initDB(): Promise<void> {
    try {
        await authenticateDB(); // создание коннекта к базе
        await syncDatabase(); // инициализация моделей
        await runMigrations(); // ручные миграции
        await seedDatabase(); // наполнение таблиц
        loggerDB.info("Database initialized successfully");
    } catch (error) {
        loggerDB.error("Database initialization failed:", error);
        process.exit(1);
    }
}
export default initDB;
