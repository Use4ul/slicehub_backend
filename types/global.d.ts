export interface SeedsData {
    countryIds?: {
        [isoCode: string]: number; // RU -> 1, US -> 2, etc.
    };
    categoryIds?: {
        [slug: string]: number; // 'toys-games' -> 1, 'home-decor' -> 2
    };
    roleIds?: {
        [name: string]: number; // 'user' -> 1, 'admin' -> 2
    };
}

declare global {
    namespace NodeJS {
        interface Global {
            seedsData?: SeedsData;
        }
    }

    namespace Express {
        interface Request {
            requestId: string;
        }
    }
}

export {};
