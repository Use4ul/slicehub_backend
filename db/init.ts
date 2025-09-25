import { syncDatabase } from './sequelize/sync';
import { authenticateDB } from './sequelize';
import { models } from './sequelize';

export async function initDB(): Promise<void> {
    try {
        await authenticateDB();

        const forceSync = true;
        
        // Сначала синхронизируем без данных
        await syncDatabase({ force: forceSync });
console.log(forceSync);

        if (forceSync) {
            await seedDatabase();
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

async function seedDatabase(): Promise<void> {
    try {
        // 1. Роли
        await models.Role.bulkCreate([
            { id: 1, name: 'user', description: 'Обычный пользователь' },
            { id: 2, name: 'admin', description: 'Администратор системы' },
        ], { ignoreDuplicates: true });

        // 2. Статусы пользователей
        await models.UserStatus.bulkCreate([
            { id: 1, name: 'active', description: 'Активный пользователь', allows_login: true, is_visible: true, is_terminated: false },
            { id: 2, name: 'inactive', description: 'Неактивный пользователь', allows_login: false, is_visible: true, is_terminated: false },
            { id: 3, name: 'banned', description: 'Заблокированный пользователь', allows_login: false, is_visible: false, is_terminated: true },
        ], { ignoreDuplicates: true });

        // 3. Типы хранилищ
        await models.StorageType.bulkCreate([
            { id: 1, name: 'local', description: 'Локальное хранилище на сервере', requires_url_processing: false },
            { id: 2, name: 's3', description: 'Облачное хранилище (AWS S3, Yandex Cloud)', requires_url_processing: true },
            { id: 3, name: 'url', description: 'Внешняя ссылка (соцсети, CDN)', requires_url_processing: true },
            { id: 4, name: 'ftp', description: 'FTP сервер', requires_url_processing: true },
            { id: 5, name: 'ipfs', description: 'IPFS (децентрализованное хранилище)', requires_url_processing: true },
        ], { ignoreDuplicates: true });

        // 4. Типы токенов
        await models.TokenType.bulkCreate([
            { id: 1, name: 'activation', description: 'Токен активации аккаунта', default_expiry_interval: 86400000, is_single_use: true, max_attempts: 1 },
            { id: 2, name: 'password_reset', description: 'Токен сброса пароля', default_expiry_interval: 3600000, is_single_use: true, max_attempts: 3 },
            { id: 3, name: 'email_change', description: 'Токен изменения email', default_expiry_interval: 3600000, is_single_use: true, max_attempts: 1 },
        ], { ignoreDuplicates: true });

        // 5. Страны (только Россия)
        await models.Country.bulkCreate([
            { 
                id: 1, 
                name: 'Россия', 
                iso_code: 'RU', 
                phone_code: '+7', 
                is_active: true 
            },
        ], { ignoreDuplicates: true });

        // 6. Города-миллионники России
        await models.City.bulkCreate([
            { id: 1, country_id: 1, name: 'Москва', name_en: 'Moscow', population: 12655000, timezone: 'Europe/Moscow', is_active: true },
            { id: 2, country_id: 1, name: 'Санкт-Петербург', name_en: 'Saint Petersburg', population: 5398000, timezone: 'Europe/Moscow', is_active: true },
            { id: 3, country_id: 1, name: 'Новосибирск', name_en: 'Novosibirsk', population: 1625000, timezone: 'Asia/Novosibirsk', is_active: true },
            { id: 4, country_id: 1, name: 'Екатеринбург', name_en: 'Yekaterinburg', population: 1495000, timezone: 'Asia/Yekaterinburg', is_active: true },
            { id: 5, country_id: 1, name: 'Казань', name_en: 'Kazan', population: 1257000, timezone: 'Europe/Moscow', is_active: true },
            { id: 6, country_id: 1, name: 'Нижний Новгород', name_en: 'Nizhny Novgorod', population: 1244000, timezone: 'Europe/Moscow', is_active: true },
            { id: 7, country_id: 1, name: 'Челябинск', name_en: 'Chelyabinsk', population: 1192000, timezone: 'Asia/Yekaterinburg', is_active: true },
            { id: 8, country_id: 1, name: 'Самара', name_en: 'Samara', population: 1144000, timezone: 'Europe/Samara', is_active: true },
            { id: 9, country_id: 1, name: 'Омск', name_en: 'Omsk', population: 1129000, timezone: 'Asia/Omsk', is_active: true },
            { id: 10, country_id: 1, name: 'Ростов-на-Дону', name_en: 'Rostov-on-Don', population: 1130000, timezone: 'Europe/Moscow', is_active: true },
            { id: 11, country_id: 1, name: 'Уфа', name_en: 'Ufa', population: 1126000, timezone: 'Asia/Yekaterinburg', is_active: true },
            { id: 12, country_id: 1, name: 'Красноярск', name_en: 'Krasnoyarsk', population: 1094000, timezone: 'Asia/Krasnoyarsk', is_active: true },
            { id: 13, country_id: 1, name: 'Воронеж', name_en: 'Voronezh', population: 1058000, timezone: 'Europe/Moscow', is_active: true },
            { id: 14, country_id: 1, name: 'Пермь', name_en: 'Perm', population: 1048000, timezone: 'Asia/Yekaterinburg', is_active: true },
            { id: 15, country_id: 1, name: 'Волгоград', name_en: 'Volgograd', population: 1016000, timezone: 'Europe/Volgograd', is_active: true },
        ], { ignoreDuplicates: true });

        // 7. Типы файлов (3D форматы + CAD программы)
        await models.FileType.bulkCreate([
            // 3D форматы для печати
            { id: 1, extension: 'stl', description: 'STL - Stereolithography' },
            { id: 2, extension: 'obj', description: 'OBJ - Wavefront Object' },
            { id: 3, extension: '3mf', description: '3MF - 3D Manufacturing Format' },
            { id: 4, extension: 'amf', description: 'AMF - Additive Manufacturing File Format' },
            { id: 5, extension: 'step', description: 'STEP - Standard for the Exchange of Product Data' },
            { id: 6, extension: 'iges', description: 'IGES - Initial Graphics Exchange Specification' },
            
            // CAD программы
            { id: 7, extension: 'sldprt', description: 'SolidWorks Part File' },
            { id: 8, extension: 'sldasm', description: 'SolidWorks Assembly File' },
            { id: 9, extension: 'ipt', description: 'Autodesk Inventor Part' },
            { id: 10, extension: 'iam', description: 'Autodesk Inventor Assembly' },
            { id: 11, extension: 'prt', description: 'Siemens NX Part' },
            { id: 12, extension: 'catpart', description: 'CATIA Part' },
            { id: 13, extension: 'catproduct', description: 'CATIA Product' },
            { id: 14, extension: 'fcstd', description: 'FreeCAD Document' },
            { id: 15, extension: '3d', description: 'KOMPAS-3D Document' },
            { id: 16, extension: 'm3d', description: 'KOMPAS-3D Model' },
            { id: 17, extension: 'a3d', description: 'KOMPAS-3D Assembly' },
            
            // Дизайнерские программы
            { id: 18, extension: 'blend', description: 'Blender Project' },
            { id: 19, extension: 'max', description: '3ds Max Scene' },
            { id: 20, extension: 'mb', description: 'Maya Binary' },
            { id: 21, extension: 'ma', description: 'Maya ASCII' },
            { id: 22, extension: 'ztl', description: 'ZBrush Tool' },
            { id: 23, extension: 'skp', description: 'SketchUp Document' },
            
            // Дополнительные форматы
            { id: 24, extension: 'fbx', description: 'Filmbox' },
            { id: 25, extension: 'dae', description: 'COLLADA' },
            { id: 26, extension: 'ply', description: 'Polygon File Format' },
        ], { ignoreDuplicates: true });

        // 8. Лицензии
        await models.License.bulkCreate([
            { id: 1, name: 'CC BY', description: 'Creative Commons Attribution', url: 'https://creativecommons.org/licenses/by/4.0/', allows_commercial_use: true, allows_modification: true, requires_attribution: true },
            { id: 2, name: 'CC BY-SA', description: 'Creative Commons Attribution-ShareAlike', url: 'https://creativecommons.org/licenses/by-sa/4.0/', allows_commercial_use: true, allows_modification: true, requires_attribution: true },
            { id: 3, name: 'CC BY-NC', description: 'Creative Commons Attribution-NonCommercial', url: 'https://creativecommons.org/licenses/by-nc/4.0/', allows_commercial_use: false, allows_modification: true, requires_attribution: true },
            { id: 4, name: 'CC0', description: 'Creative Commons Zero', url: 'https://creativecommons.org/publicdomain/zero/1.0/', allows_commercial_use: true, allows_modification: true, requires_attribution: false },
            { id: 5, name: 'GPL', description: 'GNU General Public License', url: 'https://www.gnu.org/licenses/gpl-3.0.html', allows_commercial_use: true, allows_modification: true, requires_attribution: true },
        ], { ignoreDuplicates: true });

        // 9. Категории моделей (базовые)
        await models.ModelCategory.bulkCreate([
            { id: 1, name: 'Игрушки и игры', description: 'Игрушки, настольные игры, головоломки', parent_id: null, slug: 'toys-games', is_active: true, sort_order: 1 },
            { id: 2, name: 'Дом и интерьер', description: 'Предметы для дома и декора', parent_id: null, slug: 'home-decor', is_active: true, sort_order: 2 },
            { id: 3, name: 'Техника и гаджеты', description: 'Технические устройства и аксессуары', parent_id: null, slug: 'tech-gadgets', is_active: true, sort_order: 3 },
            { id: 4, name: 'Образование', description: 'Образовательные модели и пособия', parent_id: null, slug: 'education', is_active: true, sort_order: 4 },
            { id: 5, name: 'Искусство и скульптура', description: 'Художественные произведения', parent_id: null, slug: 'art-sculpture', is_active: true, sort_order: 5 },
        ], { ignoreDuplicates: true });

        console.log('Database seeded successfully with all reference data');
    } catch (error) {
        console.error('Database seeding failed:', error);
        throw error;
    }
}

export default initDB;