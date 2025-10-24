# Database Seeds

Модуль для заполнения базы данных начальными и тестовыми данными.

## Структура

### Default Seeds (обязательные)
Справочники и базовые данные, необходимые для работы приложения:
- `roles.seeds.ts` - роли пользователей (admin, moderator, user)
- `userStatuses.seeds.ts` - статусы пользователей (active, banned, pending, etc.)
- `storageTypes.seeds.ts` - типы хранилищ (local, s3, etc.)
- `tokenTypes.seeds.ts` - типы токенов (refresh, access, etc.)
- `countries.seeds.ts` - страны
- `cities.seeds.ts` - города
- `fileTypes.seeds.ts` - типы файлов (stl, obj, gcode, etc.)
- `licenses.seeds.ts` - типы лицензий
- `modelCategoriesSeed.ts` - категории 3D моделей
- `tags.seeds.ts` - теги для моделей

### Mock Seeds (тестовые данные)
- `mockUsers.seeds.ts` - генерация 50 пользователей с профилями, моделями, коллекциями, комментариями и рейтингами

## Настройки в конфиге

В `conf.json` доступны следующие настройки:

```json
{
  "settings": {
    "sync": {
      "mockSeeding": {
        "enableMockSeeds": false,    // Включить/выключить генерацию тестовых данных
        "mockSeedsRunCount": 1       // Сколько раз выполнить генерацию (за один запуск)
      }
    }
  }
}
```

> ⚠️ **Важно:** Эти настройки применяются только к **Mock Seeds** (тестовым данным). 
> **Default Seeds** (справочники) выполняются всегда при каждом запуске!

### Параметры:

- **enableMockSeeds** (`boolean`) - включает/выключает выполнение **mock seeds** при старте приложения
  - `true` - mock seeds будут выполняться
  - `false` - mock seeds будут пропущены (default seeds все равно выполнятся)

- **mockSeedsRunCount** (`number`) - сколько раз выполнить генерацию за один запуск приложения
  - `1` - выполнить один раз (по умолчанию)
  - `3` - выполнить 3 раза подряд
  - `10` - выполнить 10 раз подряд
  - и т.д.

## Использование

### Первый запуск (с тестовыми данными)

Если нужны тестовые данные при первом запуске:
```json
"settings": {
  "sync": {
    "mockSeeding": {
      "enableMockSeeds": true,
      "mockSeedsRunCount": 1
    }
  }
}
```

Перезапустите приложение - будут созданы:
- Справочники (роли, статусы, категории, теги и т.д.)
- 50 пользователей с моделями, коллекциями, комментариями

> ✅ **Автоматическое отключение:** После успешного выполнения `enableMockSeeds` автоматически устанавливается в `false`, чтобы предотвратить повторное выполнение при следующем запуске.

### Генерация большого количества данных

Если нужно сгенерировать больше пользователей (например, 150):
```json
"settings": {
  "sync": {
    "mockSeeding": {
      "enableMockSeeds": true,
      "mockSeedsRunCount": 3    // 50 × 3 = 150 пользователей
    }
  }
}
```

> ⚠️ **Важно:** При `mockSeedsRunCount > 1` каждая итерация создаст новый набор пользователей с уникальными данными (slug содержит случайный суффикс).

### Продакшн

Для продакшена всегда отключайте mock seeds:
```json
"settings": {
  "sync": {
    "mockSeeding": {
      "enableMockSeeds": false,
      "mockSeedsRunCount": 1
    }
  }
}
```

## Примеры логов

### Успешное выполнение (mockSeedsRunCount: 1):
```
🌱 Starting database seeding...
📚 Running default seeds (dictionaries)...
Running seeder: Roles
✅ Seeder completed: Roles
...
✅ Default seeds completed
🎭 Running mock seeds 1 time(s)...
Running seeder: MockUsers
✅ Seeder completed: MockUsers
🎉 All seeders completed successfully
✅ Config updated: mockSeedingOptions.enableMockSeeds = false
```

### Множественное выполнение (mockSeedsRunCount: 3):
```
🎭 Running mock seeds 3 time(s)...

📦 Mock seeds iteration 1/3
Running seeder: MockUsers
✅ Seeder completed: MockUsers
✅ Iteration 1/3 completed

📦 Mock seeds iteration 2/3
Running seeder: MockUsers
✅ Seeder completed: MockUsers
✅ Iteration 2/3 completed

📦 Mock seeds iteration 3/3
Running seeder: MockUsers
✅ Seeder completed: MockUsers
✅ Iteration 3/3 completed

🎉 All seeders completed successfully
✅ Config updated: mockSeedingOptions.enableMockSeeds = false
```

### Пропуск mock seeds (отключено):
```
🌱 Starting database seeding...
📚 Running default seeds (dictionaries)...
...
✅ Default seeds completed
⏭️ Mock seeding disabled in config. Skipping...
```

## Разработка

### Добавление нового seed

1. Создайте файл в `db/sequelize/seeds/`, например `newData.seeds.ts`
2. Реализуйте интерфейс `Seeder`:
```typescript
import { Seeder } from "./index";

export const newDataSeed: Seeder = {
    name: "NewData",
    async run() {
        // Логика заполнения данных
    }
};
```
3. Добавьте в массив `default_seeds` или `mock_seeds` в `index.ts`
4. Экспортируйте из `index.ts`

### Лучшие практики

- Default seeds должны быть идемпотентными (использовать `findOrCreate` или проверять существование)
- Mock seeds могут генерировать уникальные данные при каждом запуске
- Используйте `syncLogger` для логирования
- Обрабатывайте ошибки и откатывайте транзакции при необходимости

