/**
 * Транслитерация кириллицы в латиницу
 */
export function transliterate(text: string): string {
    const map: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
        'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
        'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
        'Я': 'Ya'
    };
    
    return text.split('').map(char => map[char] || char).join('');
}

/**
 * Генерация базового slug из текста
 * Пример: "Дракон Модель" -> "drakon-model"
 */
export function generateSlug(text: string): string {
    return transliterate(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Генерация уникального slug с добавлением случайного суффикса
 * Пример: "Дракон Модель" -> "drakon-model-a5f2g8"
 */
export function generateUniqueSlug(text: string): string {
    const baseSlug = generateSlug(text);
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${suffix}`;
}

/**
 * Генерация slug с пользовательским суффиксом
 * Пример: generateSlugWithSuffix("Дракон", "123") -> "drakon-123"
 */
export function generateSlugWithSuffix(text: string, suffix: string | number): string {
    const baseSlug = generateSlug(text);
    return `${baseSlug}-${suffix}`;
}

