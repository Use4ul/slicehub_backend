import { TokenType } from "../models";

// Default seeds data
export const tokenTypesSeed = {
    name: "TokenTypes",
    async run() {
        await TokenType.bulkCreate(
            [
                {
                    name: "activation",
                    description: "Токен активации аккаунта",
                    default_expiry_interval: 86400000,
                    is_single_use: true,
                    max_attempts: 1,
                },
                {
                    name: "password_reset",
                    description: "Токен сброса пароля",
                    default_expiry_interval: 3600000,
                    is_single_use: true,
                    max_attempts: 3,
                },
                {
                    name: "email_change",
                    description: "Токен изменения email",
                    default_expiry_interval: 3600000,
                    is_single_use: true,
                    max_attempts: 1,
                },
            ],
            { ignoreDuplicates: true }
        );
    },
};
