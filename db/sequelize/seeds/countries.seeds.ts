import { Country } from "../models";
import { SeedsData } from "../../../types/global";

interface MyGlobal {
    seedsData?: SeedsData;
}

const g = global as unknown as MyGlobal;

export const countriesSeed = {
    name: "Countries",
    async run() {
        const [russia] = await Country.findOrCreate({
            where: { iso_code: "RU" },
            defaults: {
                name: "Россия",
                iso_code: "RU",
                phone_code: "+7",
                is_active: true,
            },
        });

        if (!g.seedsData) g.seedsData = {};
        if (!g.seedsData.countryIds) g.seedsData.countryIds = {};

        g.seedsData.countryIds["RU"] = russia.id;
    },
};
