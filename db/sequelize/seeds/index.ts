import { syncLogger } from "../../../sys/logger";
import * as fs from "fs";
import * as path from "path";
import { EMOJI } from "../../../src/utils/emojis";

import { rolesSeed } from "../seeds/roles.seeds";
import { userStatusesSeed } from "../seeds/userStatuses.seeds";
import { storageTypesSeed } from "../seeds/storageTypes.seeds";
import { tokenTypesSeed } from "../seeds/tokenTypes.seeds";
import { countriesSeed } from "../seeds/countries.seeds";
import { citiesSeed } from "../seeds/cities.seeds";
import { fileTypesSeed } from "../seeds/fileTypes.seeds";
import { licensesSeed } from "../seeds/licenses.seeds";
import { modelCategoriesSeed } from "./modelCategoriesSeed";
import { tagsSeed } from "./tags.seeds";
import { mockUsersSeed } from "./mockUsers.seeds";

import { SeedsData } from "../../../types/global";
import config from "../../../config/index";

interface MyGlobal {
    seedsData?: SeedsData;
}

const g = global as unknown as MyGlobal;

export interface Seeder {
    name: string;
    run(): Promise<void>;
}

if (!g.seedsData) {
    g.seedsData = {};
}

// Seeds for initial data
const default_seeds: Seeder[] = [
    rolesSeed,
    userStatusesSeed,
    storageTypesSeed,
    tokenTypesSeed,
    countriesSeed,
    citiesSeed,
    fileTypesSeed,
    licensesSeed,
    modelCategoriesSeed,
    tagsSeed,
];

const mock_seeds: Seeder[] = [
    mockUsersSeed,
];

const allSeeders: Seeder[] = [
    ...default_seeds, ...mock_seeds
];

function disableMockSeeds(): void {
    try {
        const configPath = path.join(__dirname, "../../../conf.json");
        const configData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        
        configData.settings.sync.mockSeeding.enableMockSeeds = false;
        
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 4), "utf-8");
        syncLogger.info(`${EMOJI.SUCCESS} Config updated: settings.sync.mockSeeding.enableMockSeeds = false`);
    } catch (error) {
        syncLogger.error(`${EMOJI.ERROR} Failed to update config:`, error);
    }
}


export async function seedDatabase(): Promise<void> {
    try {
        const mockSeedingOptions = config.settings.sync.mockSeeding;

        if (!g.seedsData) {
            g.seedsData = {};
        }

        syncLogger.info(`${EMOJI.START} Starting database seeding...`);

        // Всегда выполняем default seeds (справочники)
        syncLogger.info(`${EMOJI.DATABASE} Running default seeds (dictionaries)...`);
        for (const seeder of default_seeds) {
            syncLogger.info(`Running seeder: ${seeder.name}`);
            await seeder.run();
            syncLogger.info(`${EMOJI.SUCCESS} Seeder completed: ${seeder.name}`);
        }
        syncLogger.info(`${EMOJI.SUCCESS} Default seeds completed`);

        // Проверяем, нужно ли выполнять mock seeds
        // Приоритет: ENV переменная > conf.json
        const enableMockSeeds = process.env.ENABLE_MOCK_SEEDS === "true" 
            || (process.env.ENABLE_MOCK_SEEDS === undefined && mockSeedingOptions.enableMockSeeds);
        
        const seedSource = process.env.ENABLE_MOCK_SEEDS !== undefined ? "ENV" : "conf.json";
        
        if (!enableMockSeeds) {
            syncLogger.info(`${EMOJI.SKIP} Mock seeding disabled (source: ${seedSource}). Skipping...`);
            return;
        }

        // Выполняем mock seeds указанное количество раз
        // Приоритет: ENV переменная > conf.json
        const runCount = parseInt(
            process.env.MOCK_SEEDS_RUN_COUNT || 
            String(mockSeedingOptions.mockSeedsRunCount || 1)
        );
        const countSource = process.env.MOCK_SEEDS_RUN_COUNT !== undefined ? "ENV" : "conf.json";
        
        syncLogger.info(`${EMOJI.MOCK_DATA} Running mock seeds ${runCount} time(s) (source: ${countSource})...`);
        
        for (let iteration = 1; iteration <= runCount; iteration++) {
            if (runCount > 1) {
                syncLogger.info(`\n${EMOJI.PACKAGE} Mock seeds iteration ${iteration}/${runCount}`);
            }
            
            for (const seeder of mock_seeds) {
                syncLogger.info(`Running seeder: ${seeder.name}`);
                await seeder.run();
                syncLogger.info(`${EMOJI.SUCCESS} Seeder completed: ${seeder.name}`);
            }
            
            if (runCount > 1) {
                syncLogger.info(`${EMOJI.SUCCESS} Iteration ${iteration}/${runCount} completed`);
            }
        }

        syncLogger.info(`${EMOJI.FINISH} All seeders completed successfully`);
        
        // Автоматически отключаем mock seeds после успешного выполнения
        disableMockSeeds();
    } catch (error) {
        syncLogger.error(`${EMOJI.ERROR} Database seeding failed:`, error);
        throw error;
    } finally {
        delete g.seedsData;
        syncLogger.info(`${EMOJI.CLEANUP} seedsData cleaned up from global`);
    }
}

export {
    rolesSeed,
    userStatusesSeed,
    storageTypesSeed,
    tokenTypesSeed,
    countriesSeed,
    citiesSeed,
    fileTypesSeed,
    licensesSeed,
    modelCategoriesSeed,
    tagsSeed,
    mockUsersSeed,
};
