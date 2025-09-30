import { City } from "../models";
import { SeedsData } from "../../../types/global";

interface MyGlobal {
    seedsData?: SeedsData;
}

const g = global as unknown as MyGlobal;

export const citiesSeed = {
    name: "Cities",
    async run() {
        const russiaId = g.seedsData?.countryIds?.RU;

        if (!russiaId) {
            throw new Error("Country RU ID not found in seedsData");
        }

        await City.bulkCreate(
            [
                {
                    country_id: russiaId,
                    name: "Москва",
                    name_en: "Moscow",
                    population: 12655000,
                    timezone: "Europe/Moscow",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Санкт-Петербург",
                    name_en: "Saint Petersburg",
                    population: 5398000,
                    timezone: "Europe/Moscow",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Новосибирск",
                    name_en: "Novosibirsk",
                    population: 1625000,
                    timezone: "Asia/Novosibirsk",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Екатеринбург",
                    name_en: "Yekaterinburg",
                    population: 1495000,
                    timezone: "Asia/Yekaterinburg",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Казань",
                    name_en: "Kazan",
                    population: 1257000,
                    timezone: "Europe/Moscow",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Нижний Новгород",
                    name_en: "Nizhny Novgorod",
                    population: 1244000,
                    timezone: "Europe/Moscow",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Челябинск",
                    name_en: "Chelyabinsk",
                    population: 1192000,
                    timezone: "Asia/Yekaterinburg",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Самара",
                    name_en: "Samara",
                    population: 1144000,
                    timezone: "Europe/Samara",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Омск",
                    name_en: "Omsk",
                    population: 1129000,
                    timezone: "Asia/Omsk",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Ростов-на-Дону",
                    name_en: "Rostov-on-Don",
                    population: 1130000,
                    timezone: "Europe/Moscow",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Уфа",
                    name_en: "Ufa",
                    population: 1126000,
                    timezone: "Asia/Yekaterinburg",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Красноярск",
                    name_en: "Krasnoyarsk",
                    population: 1094000,
                    timezone: "Asia/Krasnoyarsk",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Воронеж",
                    name_en: "Voronezh",
                    population: 1058000,
                    timezone: "Europe/Moscow",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Пермь",
                    name_en: "Perm",
                    population: 1048000,
                    timezone: "Asia/Yekaterinburg",
                    is_active: true,
                },
                {
                    country_id: russiaId,
                    name: "Волгоград",
                    name_en: "Volgograd",
                    population: 1016000,
                    timezone: "Europe/Volgograd",
                    is_active: true,
                },
            ],
            { ignoreDuplicates: true }
        );
    },
};
