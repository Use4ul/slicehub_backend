export interface SeedsData {
    countryIds?: {
        [isoCode: string]: number; // RU -> 1, US -> 2, etc.
    };
    // Можно добавить другие типы данных по мере необходимости
    categoryIds?: {
        [slug: string]: number; // 'toys-games' -> 1, 'home-decor' -> 2
    };
    roleIds?: {
        [name: string]: number; // 'user' -> 1, 'admin' -> 2
    };
    // Добавьте другие поля по необходимости
}

declare global {
    namespace NodeJS {
        interface Global {
            seedsData?: SeedsData;
        }
    }
}

export {};
