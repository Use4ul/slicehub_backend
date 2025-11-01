/**
 * Эмодзи для использования в логах и сообщениях
 */
export const EMOJI = {
    // Процессы и статусы
    START: "🌱",
    SUCCESS: "✅",
    ERROR: "❌",
    WARNING: "⚠️",
    INFO: "ℹ️",
    SKIP: "⏭️",
    FINISH: "🎉",
    CLEANUP: "🧹",
    
    // Специфичные операции
    DATABASE: "📚",
    MOCK_DATA: "🎭",
    PACKAGE: "📦",
    MIGRATION: "🔄",
    ROLLBACK: "↩️",
    
    // Роли и пользователи
    ADMIN: "👑",
    MODERATOR: "🛡️",
    USER: "👤",
    
    // Объекты
    FILE: "📄",
    FOLDER: "📁",
    GEAR: "⚙️",
    ROCKET: "🚀",
    CHART: "📊",
    TARGET: "🎯",
} as const;

export type EmojiKey = keyof typeof EMOJI;

