# Sanitizers

Функции для подготовки и нормализации данных перед записью в БД.

## Файлы

### `slug.ts`
Утилиты для генерации URL-friendly slug из текста. Использует библиотеку `slugify` для транслитерации.

**Функции:**
- `generateSlug(text)` - базовый slug из текста
- `generateSlugWithUsername(text, userName)` - slug с user_name владельца в качестве суффикса
- `generateSlugWithSuffix(text, suffix)` - slug с пользовательским суффиксом
- `generateUniqueSlug(text)` - (deprecated) slug со случайным суффиксом

**Использование:**
```typescript
import { generateSlugWithUsername } from "../../utils/sanitizers/slug";

// Для модели пользователя
const slug = generateSlugWithUsername("Дракон Модель", "alexey_ivanov");
// Результат: "drakon-model-alexey_ivanov"

// Базовый slug
const basicSlug = generateSlug("Дракон Модель");
// Результат: "drakon-model"
```

**Зависимости:**
- `slugify` - библиотека для генерации slug с поддержкой транслитерации

## Будущие дополнения

Здесь можно разместить другие sanitizers:
- `email.ts` - нормализация email адресов
- `phone.ts` - нормализация телефонных номеров  
- `username.ts` - валидация и нормализация имен пользователей
- `html.ts` - санитизация HTML контента
- и т.д.

