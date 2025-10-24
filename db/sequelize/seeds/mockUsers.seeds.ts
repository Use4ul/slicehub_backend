import {
    User,
    UserStatus,
    Role,
    UserRole,
    Profile,
    StorageType,
    ModelCategory,
    Tag,
    License,
    Model3d,
    ModelFile,
    ModelPreview,
    ModelTag,
    ModelLicense,
    ModelRating,
    ModelComment,
    Collection,
    CollectionItem,
} from "../models";
import { generateSlugWithUsername } from "../../../src/utils/sanitizers/slug";
import { syncLogger } from "../../../sys/logger";
import { EMOJI } from "../../../src/utils/emojis";

const firstNames = [
    "Алексей", "Дмитрий", "Иван", "Сергей", "Андрей", "Михаил", "Александр", "Владимир",
    "Николай", "Денис", "Егор", "Артем", "Павел", "Максим", "Роман", "Олег", "Виктор",
    "Игорь", "Петр", "Анна", "Мария", "Елена", "Ольга", "Наталья", "Татьяна", "Ирина",
    "Светлана", "Екатерина", "Юлия", "Дарья", "Анастасия", "Виктория", "Полина", "Кристина",
];

const lastNames = [
    "Иванов", "Смирнов", "Кузнецов", "Попов", "Соколов", "Лебедев", "Козлов", "Новиков",
    "Морозов", "Петров", "Волков", "Соловьев", "Васильев", "Зайцев", "Павлов", "Семенов",
    "Голубев", "Виноградов", "Богданов", "Воробьев", "Федоров", "Михайлов", "Беляев",
];

const cities = [1, 2, 3, 4, 5, 6, 7, 8]; // ID городов из seeds

const modelTitles = [
    "Дракон", "Меч", "Щит", "Шлем", "Ваза", "Шахматы", "Кубок", "Статуэтка",
    "Подставка для телефона", "Органайзер", "Шестеренка", "Робот", "Космический корабль",
    "Животное", "Цветок", "Брелок", "Фигурка", "Декор", "Игрушка", "Пазл", "Конструктор",
    "Держатель", "Кольцо", "Кулон", "Браслет", "Серьги", "Модель самолета", "Модель танка",
];

const descriptions = [
    "Высокодетализированная 3D модель для печати",
    "Идеально подходит для начинающих",
    "Профессиональная модель с отличной детализацией",
    "Простая в печати, не требует поддержек",
    "Модель разработана с учетом всех нюансов печати",
    "Отличный подарок для любителей 3D печати",
    "Уникальный дизайн, созданный с нуля",
    "Функциональная и красивая модель",
];

const aboutTexts = [
    "3D моделлер с опытом более 5 лет. Специализируюсь на функциональных моделях.",
    "Люблю создавать красивые и полезные вещи для 3D печати.",
    "Профессиональный дизайнер. Создаю модели на заказ.",
    "Энтузиаст 3D печати. Делюсь своими работами с сообществом.",
    "Начинающий моделлер, но уже с портфолио интересных работ.",
    "Инженер по образованию, моделлер по призванию.",
];

const comments = [
    "Отличная модель! Спасибо!",
    "Печатается без проблем, рекомендую",
    "Супер детализация, очень доволен",
    "Качественная работа автора",
    "Можно добавить больше деталей",
    "Именно то, что искал!",
    "Печатал на Ender 3, вышло идеально",
    "Классная модель, но сложная в печати",
    "Спасибо за модель, буду еще качать",
    "Очень понравилось, 10/10",
];

function generateS3Url(type: string, filename: string): string {
    return `https://slicehub-storage.s3.amazonaws.com/${type}/${filename}`;
}

function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Генерация классических никнеймов пользователей (латиница)
const usernamePatterns = [
    // Имя + фамилия стиль
    "alex_smith", "john_doe", "mike_jones", "sarah_wilson", "emma_brown",
    "david_clark", "lisa_miller", "tom_anderson", "jane_taylor", "robert_lee",
    
    // Геймерский стиль
    "dark_knight", "shadow_hunter", "night_rider", "storm_breaker", "ice_warrior",
    "fire_mage", "thunder_lord", "sky_walker", "moon_light", "star_gazer",
    
    // Профессиональный стиль
    "pro_designer", "cool_developer", "master_coder", "tech_guru", "digital_artist",
    "creative_mind", "pixel_master", "code_ninja", "web_wizard", "game_maker",
    
    // Простой стиль
    "user", "player", "gamer", "maker", "builder", "creator", "artist", "designer",
    "developer", "engineer", "architect", "painter", "sculptor", "musician",
    
    // Комбинированный стиль
    "happy_panda", "lazy_cat", "crazy_fox", "smart_wolf", "brave_lion",
    "swift_eagle", "wise_owl", "wild_tiger", "gentle_bear", "loyal_dog",
];

function generateUsername(index: number): string {
    const pattern = usernamePatterns[index % usernamePatterns.length];
    const randomSuffix = Math.floor(Math.random() * 1000);
    
    // Для некоторых паттернов добавляем цифры
    if (pattern.includes("_")) {
        return `${pattern}${randomSuffix}`;
    } else {
        return `${pattern}_${randomSuffix}`;
    }
}

export const mockUsersSeed = {
    name: "MockUsers",
    async run() {
        syncLogger.info(`${EMOJI.START} Starting mock users seed...`);

        const activeStatus = await UserStatus.findOne({ where: { name: "active" } });
        const roleUser = await Role.findOne({ where: { name: "user" } });
        const roleAdmin = await Role.findOne({ where: { name: "admin" } });
        const roleModerator = await Role.findOne({ where: { name: "moderator" } });
        const s3Storage = await StorageType.findOne({ where: { name: "s3" } });

        if (!activeStatus || !roleUser || !roleAdmin || !roleModerator || !s3Storage) {
            throw new Error("Required seed data not found");
        }

        // Получаем категории и теги
        const categories = await ModelCategory.findAll({ where: { parent_id: null } });
        const tags = await Tag.findAll({ limit: 20 });
        const licenses = await License.findAll({ limit: 5 });

        if (categories.length === 0 || tags.length === 0 || licenses.length === 0) {
            throw new Error("Categories, tags or licenses not found. Run base seeds first.");
        }

        const users: any[] = [];
        const startDate = new Date("2023-01-01");
        const endDate = new Date();

        // Создаем 50 пользователей
        for (let i = 0; i < 50; i++) {
            const firstName = randomElement(firstNames);
            const lastName = randomElement(lastNames);
            const userName = generateUsername(i);
            const cityId = randomElement(cities);

            const user = await User.create({
                user_name: userName,
                display_name: `${firstName} ${lastName}`,
                status_id: activeStatus.id,
                email_verified: Math.random() > 0.3,
                phone_verified: Math.random() > 0.5,
                last_login_at: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate),
                created_at: randomDate(startDate, endDate),
            });

            // Создаем профиль
            await Profile.create({
                user_id: user.id,
                avatar_filename: generateS3Url("avatars", `${user.id}.jpg`),
                avatar_storage_type: s3Storage.id,
                first_name: firstName,
                last_name: lastName,
                country_id: 1, // Россия
                city_id: cityId,
                timezone: "Europe/Moscow",
                contact_email: `${userName}@example.com`,
                contact_phone: `+7${randomInt(9000000000, 9999999999)}`,
                address: {
                    street: `ул. ${randomElement(["Ленина", "Пушкина", "Гагарина", "Мира"])}`,
                    building: randomInt(1, 100).toString(),
                },
                about: i % 3 === 0 ? randomElement(aboutTexts) : undefined,
            });

            users.push(user);
        }

        syncLogger.info(`${EMOJI.SUCCESS} Created ${users.length} users with profiles`);

        // Назначаем роли
        await UserRole.create({ user_id: users[0].id, role_id: roleAdmin.id });
        syncLogger.info(`${EMOJI.ADMIN} Admin: ${users[0].user_name}`);

        await UserRole.create({ user_id: users[1].id, role_id: roleModerator.id });
        syncLogger.info(`${EMOJI.MODERATOR} Moderator: ${users[1].user_name}`);

        for (let i = 2; i < users.length; i++) {
            await UserRole.create({ user_id: users[i].id, role_id: roleUser.id });
        }

        // Создаем модели (у 30 из 50 пользователей)
        const modelsData: any[] = [];
        const usersWithModels = users.slice(2, 32); // 30 пользователей

        for (const user of usersWithModels) {
            const modelCount = randomInt(1, 8);

            for (let i = 0; i < modelCount; i++) {
                const title = `${randomElement(modelTitles)} ${randomInt(1, 1000)}`;
                const slug = generateSlugWithUsername(title, user.user_name);
                const isDraft = Math.random() > 0.8;
                const publishedAt = isDraft ? undefined : randomDate(startDate, endDate);

                const model = await Model3d.create({
                    title,
                    description: randomElement(descriptions),
                    slug,
                    category_id: randomElement(categories).id,
                    user_id: user.id,
                    is_public: !isDraft,
                    is_for_sale: Math.random() > 0.7,
                    price: Math.random() > 0.7 ? randomInt(100, 5000) : undefined,
                    print_time_estimate: randomInt(60, 720), // минуты
                    filament_estimate: randomInt(10, 500), // граммы
                    difficulty_level: randomInt(1, 10),
                    download_count: randomInt(0, 500),
                    view_count: randomInt(10, 5000),
                    like_count: 0, // будет обновлено после создания рейтингов
                    is_featured: Math.random() > 0.9,
                    is_draft: isDraft,
                    published_at: publishedAt,
                    created_at: randomDate(startDate, endDate),
                });

                // Добавляем файлы модели
                await ModelFile.create({
                    model_id: model.id,
                    file_type_id: 1, // STL
                    original_filename: `${slug}.stl`,
                    file_size: randomInt(100000, 50000000),
                    storage_type_id: s3Storage.id,
                    storage_path: generateS3Url("models", `${model.id}/${slug}.stl`),
                    checksum_sha256: Array.from({ length: 64 }, () =>
                        randomInt(0, 15).toString(16)
                    ).join(""),
                    download_count: model.download_count,
                    is_primary: true,
                    is_published: true,
                    uploaded_by: user.id,
                    updated_at: new Date(),
                });

                // Добавляем превью
                for (let p = 0; p < randomInt(2, 5); p++) {
                    await ModelPreview.create({
                        model_id: model.id,
                        storage_type_id: s3Storage.id,
                        storage_path: generateS3Url("previews", `${model.id}/preview_${p}.jpg`),
                        file_size: randomInt(50000, 500000),
                        mime_type: "image/jpeg",
                        width: 1920,
                        height: 1080,
                        sort_order: p,
                        uploaded_by: user.id,
                    });
                }

                // Добавляем теги (1-4 тега на модель)
                const modelTags = tags.sort(() => Math.random() - 0.5).slice(0, randomInt(1, 4));
                for (const tag of modelTags) {
                    await ModelTag.create({
                        model_id: model.id,
                        tag_id: tag.id,
                    });
                }

                // Добавляем лицензию
                await ModelLicense.create({
                    model_id: model.id,
                    license_id: randomElement(licenses).id,
                    is_primary: true,
                });

                modelsData.push(model);
            }
        }

        syncLogger.info(`${EMOJI.SUCCESS} Created ${modelsData.length} 3D models with files and previews`);

        // Добавляем рейтинги (лайки) к части моделей
        const modelsWithRatings = modelsData.filter(() => Math.random() > 0.3);

        for (const model of modelsWithRatings) {
            const ratingCount = randomInt(1, 15);
            const raters = users.sort(() => Math.random() - 0.5).slice(0, ratingCount);

            for (const rater of raters) {
                if (rater.id === model.user_id) continue; // Не лайкать свою модель

                await ModelRating.create({
                    model_id: model.id,
                    user_id: rater.id,
                    rating: randomInt(3, 5),
                });
            }

            // Обновляем счетчик лайков
            await model.update({ like_count: ratingCount });
        }

        syncLogger.info(`${EMOJI.SUCCESS} Added ratings to ${modelsWithRatings.length} models`);

        // Добавляем комментарии к части моделей
        const modelsWithComments = modelsData.filter(() => Math.random() > 0.4);

        for (const model of modelsWithComments) {
            const commentCount = randomInt(1, 8);
            const commenters = users.sort(() => Math.random() - 0.5).slice(0, commentCount);

            for (const commenter of commenters) {
                await ModelComment.create({
                    model_id: model.id,
                    user_id: commenter.id,
                    parent_comment_id: undefined,
                    content: randomElement(comments),
                    is_edited: false,
                    is_deleted: false,
                    like_count: 0,
                    created_at: randomDate(model.created_at, endDate),
                    updated_at: new Date(),
                });
            }
        }

        syncLogger.info(`${EMOJI.SUCCESS} Added comments to ${modelsWithComments.length} models`);

        // Создаем коллекции (у 15 пользователей)
        const usersWithCollections = users.slice(5, 20);

        for (const user of usersWithCollections) {
            const collectionCount = randomInt(1, 3);

            for (let i = 0; i < collectionCount; i++) {
                const collection = await Collection.create({
                    user_id: user.id,
                    title: `Коллекция ${randomElement([
                        "избранного",
                        "для работы",
                        "подарков",
                        "декора",
                        "игрушек",
                    ])} ${i + 1}`,
                    description: "Моя персональная подборка интересных моделей",
                    sort_order: i,
                });

                // Добавляем модели в коллекцию
                const collectionModels = modelsData
                    .sort(() => Math.random() - 0.5)
                    .slice(0, randomInt(3, 10));

                for (let idx = 0; idx < collectionModels.length; idx++) {
                    await CollectionItem.create({
                        collection_id: collection.id,
                        model_id: collectionModels[idx].id,
                        sort_order: idx,
                    });
                }
            }
        }

        syncLogger.info(`${EMOJI.SUCCESS} Created collections for ${usersWithCollections.length} users`);
        syncLogger.info(`${EMOJI.FINISH} Mock users seed completed!`);
    },
};

