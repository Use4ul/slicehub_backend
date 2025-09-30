import { syncLogger } from "../../../sys/logger";

import { rolesSeed } from "../seeds/roles.seeds";
import { userStatusesSeed } from "../seeds/userStatuses.seeds";
import { storageTypesSeed } from "../seeds/storageTypes.seeds";
import { tokenTypesSeed } from "../seeds/tokenTypes.seeds";
import { countriesSeed } from "../seeds/countries.seeds";
import { citiesSeed } from "../seeds/cities.seeds";
import { fileTypesSeed } from "../seeds/fileTypes.seeds";
import { licensesSeed } from "../seeds/licenses.seeds";
import { modelCategoriesSeed } from "./modelCategoriesSeed";

import { SeedsData } from "../../../types/global";

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

const allSeeders: Seeder[] = [
    rolesSeed,
    userStatusesSeed,
    storageTypesSeed,
    tokenTypesSeed,
    countriesSeed,
    citiesSeed,
    fileTypesSeed,
    licensesSeed,
    modelCategoriesSeed,
];

export async function seedDatabase(): Promise<void> {
    try {
        if (!g.seedsData) {
            g.seedsData = {};
        }

        for (const seeder of allSeeders) {
            syncLogger.info(`Running seeder: ${seeder.name}`);
            await seeder.run();
            syncLogger.info(`✅ Seeder completed: ${seeder.name}`);
        }

        syncLogger.info("🎉 All seeders completed successfully");
    } catch (error) {
        syncLogger.error("❌ Database seeding failed:", error);
        throw error;
    } finally {
        delete g.seedsData;
        syncLogger.info("🧹 seedsData cleaned up from global");
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
};
