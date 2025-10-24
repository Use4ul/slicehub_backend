import slugify from "slugify";

/**
 * Генерация базового slug из текста с использованием библиотеки slugify
 * Пример: "Дракон Модель" -> "drakon-model"
 */
export function generateSlug(text: string): string {
    return slugify(text, {
        lower: true,
        strict: true,
        locale: "ru",
    });
}

/**
 * Генерация slug с user_name владельца в качестве суффикса
 * Пример: generateSlugWithUsername("Дракон Модель", "alexey_ivanov") -> "drakon-model-alexey_ivanov"
 */
export function generateSlugWithUsername(text: string, userName: string): string {
    const baseSlug = generateSlug(text);
    const userSlug = slugify(userName, {
        lower: true,
        strict: true,
    });
    return `${baseSlug}-${userSlug}`;
}

/**
 * Генерация slug с пользовательским суффиксом
 * Пример: generateSlugWithSuffix("Дракон", "123") -> "drakon-123"
 */
export function generateSlugWithSuffix(text: string, suffix: string | number): string {
    const baseSlug = generateSlug(text);
    return `${baseSlug}-${suffix}`;
}

/**
 * @deprecated Используйте generateSlugWithUsername вместо этой функции
 * Генерация уникального slug с добавлением случайного суффикса
 */
export function generateUniqueSlug(text: string): string {
    const baseSlug = generateSlug(text);
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${suffix}`;
}

