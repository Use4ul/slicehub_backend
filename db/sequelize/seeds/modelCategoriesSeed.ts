import { ModelCategory } from '../models';
import { SeedsData } from '../../../types/global';

interface MyGlobal extends NodeJS.Global {
    seedsData?: SeedsData & { categoryIds?: { [key: string]: number } };
}

const g = global as unknown as MyGlobal;

export const modelCategoriesSeed = {
    name: 'ModelCategoriesFullHierarchy',
    async run() {
        // Инициализация глобального хранилища ID категорий
        if (!g.seedsData) g.seedsData = {};
        if (!g.seedsData.categoryIds) g.seedsData.categoryIds = {};

        // Уровень 1: базовые категории, parent_id = null
        const categoriesLevel1 = [
            { name: 'Игрушки и игры', slug: 'toys-games', description: 'Игрушки, настольные игры, головоломки', is_active: true, sort_order: 1 },
            { name: 'Дом и интерьер', slug: 'home-decor', description: 'Предметы для дома и декора', is_active: true, sort_order: 2 },
            { name: 'Техника и гаджеты', slug: 'tech-gadgets', description: 'Технические устройства и аксессуары', is_active: true, sort_order: 3 },
            { name: 'Образование', slug: 'education', description: 'Образовательные модели и пособия', is_active: true, sort_order: 4 },
            { name: 'Искусство и скульптура', slug: 'art-sculpture', description: 'Художественные произведения', is_active: true, sort_order: 5 },
            { name: 'Мода и аксессуары', slug: 'fashion-accessories', description: 'Одежда, украшения, аксессуары', is_active: true, sort_order: 6 },
            { name: 'Авто и транспорт', slug: 'auto-transport', description: 'Модели транспортных средств', is_active: true, sort_order: 7 },
            { name: 'Для 3D принтеров', slug: '3d-printer-parts', description: 'Детали и аксессуары для 3D печати', is_active: true, sort_order: 8 },
        ];

        for (const cat of categoriesLevel1) {
            const [category] = await ModelCategory.findOrCreate({
                where: { slug: cat.slug },
                defaults: { ...cat, parent_id: null }
            });
            g.seedsData.categoryIds![cat.slug] = category.id;
        }

        // Уровень 2: подкатегории, для каждого ищем parent_id по slug из global
        const categoriesLevel2 = [
            { name: 'Конструкторы', slug: 'constructors', parentCategorySlug: 'toys-games', description: 'Сборные модели и конструкторы', is_active: true, sort_order: 1 },
            { name: 'Фигурки', slug: 'figures', parentCategorySlug: 'toys-games', description: 'Фигурки персонажей, животных', is_active: true, sort_order: 2 },
            { name: 'Головоломки', slug: 'puzzles', parentCategorySlug: 'toys-games', description: '3D головоломки и пазлы', is_active: true, sort_order: 3 },
            { name: 'Настольные игры', slug: 'board-games', parentCategorySlug: 'toys-games', description: 'Компоненты для настольных игр', is_active: true, sort_order: 4 },
            { name: 'Развивающие игрушки', slug: 'educational-toys', parentCategorySlug: 'toys-games', description: 'Образовательные игрушки для детей', is_active: true, sort_order: 5 },
            { name: 'Декор для дома', slug: 'home-decor-decoration', parentCategorySlug: 'home-decor', description: 'Элементы декора и интерьера', is_active: true, sort_order: 1 },
            { name: 'Органайзеры', slug: 'organizers', parentCategorySlug: 'home-decor', description: 'Органайзеры и системы хранения', is_active: true, sort_order: 2 },
            { name: 'Кухонные принадлежности', slug: 'kitchen-utensils', parentCategorySlug: 'home-decor', description: 'Посуда и кухонные аксессуары', is_active: true, sort_order: 3 },
        ];

        for (const cat of categoriesLevel2) {
            const parentId = g.seedsData.categoryIds![cat.parentCategorySlug];
            if (!parentId) throw new Error(`Parent category slug '${cat.parentCategorySlug}' not found`);

            const [category] = await ModelCategory.findOrCreate({
                where: { slug: cat.slug },
                defaults: {
                    name: cat.name,
                    description: cat.description,
                    parent_id: parentId,
                    slug: cat.slug,
                    is_active: cat.is_active,
                    sort_order: cat.sort_order,
                }
            });
            g.seedsData.categoryIds![cat.slug] = category.id;
        }

        // Уровень 3: глубокие подкатегории, аналогично
        const categoriesLevel3 = [
            { name: 'Технические конструкторы', slug: 'technical-constructors', parentCategorySlug: 'constructors', description: 'Сложные технические модели', is_active: true, sort_order: 1 },
            { name: 'Архитектурные конструкторы', slug: 'architectural-constructors', parentCategorySlug: 'constructors', description: 'Модели зданий и сооружений', is_active: true, sort_order: 2 },
            { name: 'Детские конструкторы', slug: 'kids-constructors', parentCategorySlug: 'constructors', description: 'Простые конструкторы для детей', is_active: true, sort_order: 3 },
            { name: 'Кольца', slug: 'rings', parentCategorySlug: 'fashion-accessories', description: 'Печатные кольца и перстни', is_active: true, sort_order: 1 },
            { name: 'Браслеты', slug: 'bracelets', parentCategorySlug: 'fashion-accessories', description: 'Браслеты и наручные украшения', is_active: true, sort_order: 2 },
            { name: 'Подвески', slug: 'pendants', parentCategorySlug: 'fashion-accessories', description: 'Кулоны и подвески для цепочек', is_active: true, sort_order: 3 },
            { name: 'Серьги', slug: 'earrings', parentCategorySlug: 'fashion-accessories', description: 'Печатные серьги и клипсы', is_active: true, sort_order: 4 },
        ];

        for (const cat of categoriesLevel3) {
            const parentId = g.seedsData.categoryIds![cat.parentCategorySlug];
            if (!parentId) throw new Error(`Parent category slug '${cat.parentCategorySlug}' not found`);

            const [category] = await ModelCategory.findOrCreate({
                where: { slug: cat.slug },
                defaults: {
                    name: cat.name,
                    description: cat.description,
                    parent_id: parentId,
                    slug: cat.slug,
                    is_active: cat.is_active,
                    sort_order: cat.sort_order,
                }
            });
            g.seedsData.categoryIds![cat.slug] = category.id;
        }
    }
};
