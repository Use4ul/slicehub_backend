import { Role } from "../models";

// Default seeds data
export const rolesSeed = {
    name: "Roles",
    async run() {
        await Role.bulkCreate(
            [
                { name: "user", description: "Обычный пользователь" },
                { name: "admin", description: "Администратор системы" },
                { name: "moderator", description: "Модератор контента" },
            ],
            { ignoreDuplicates: true }
        );
    },
};
