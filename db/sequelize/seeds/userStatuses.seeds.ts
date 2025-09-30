import { UserStatus } from "../models";

export const userStatusesSeed = {
    name: "UserStatuses",
    async run() {
        await UserStatus.bulkCreate(
            [
                {
                    name: "active",
                    description: "Активный пользователь",
                    allows_login: true,
                    is_visible: true,
                    is_terminated: false,
                },
                {
                    name: "inactive",
                    description: "Неактивный пользователь",
                    allows_login: false,
                    is_visible: true,
                    is_terminated: false,
                },
                {
                    name: "banned",
                    description: "Заблокированный пользователь",
                    allows_login: false,
                    is_visible: false,
                    is_terminated: true,
                },
            ],
            { ignoreDuplicates: true }
        );
    },
};
