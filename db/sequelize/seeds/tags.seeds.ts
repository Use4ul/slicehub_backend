import { Tag } from "../models";

export const tagsSeed = {
    name: "Tags",
    async run() {
        const tags = [
            { name: "Игрушка", slug: "toy" },
            { name: "Декор", slug: "decor" },
            { name: "Функциональное", slug: "functional" },
            { name: "Держатель", slug: "holder" },
            { name: "Органайзер", slug: "organizer" },
            { name: "Подарок", slug: "gift" },
            { name: "Гаджет", slug: "gadget" },
            { name: "Аксессуар", slug: "accessory" },
            { name: "Инструмент", slug: "tool" },
            { name: "Украшение", slug: "jewelry" },
            { name: "Брелок", slug: "keychain" },
            { name: "Модель", slug: "model" },
            { name: "Фигурка", slug: "figurine" },
            { name: "Робот", slug: "robot" },
            { name: "Животное", slug: "animal" },
            { name: "Космос", slug: "space" },
            { name: "Фантастика", slug: "scifi" },
            { name: "Фэнтези", slug: "fantasy" },
            { name: "Геймдев", slug: "gamedev" },
            { name: "Инженерное", slug: "engineering" },
            { name: "Минимализм", slug: "minimalism" },
            { name: "Геометрия", slug: "geometry" },
            { name: "Полезное", slug: "useful" },
            { name: "DIY", slug: "diy" },
            { name: "Hobby", slug: "hobby" },
        ];

        await Tag.bulkCreate(tags, { ignoreDuplicates: true });
    },
};

