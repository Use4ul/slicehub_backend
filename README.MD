# SliceHub Backend

Backend API для платформы 3D моделей SliceHub.

## Быстрый старт

```bash
npm install
npm run dev      # Разработка
npm run build    # Сборка
npm start        # Продакшен
```

## Структура проекта

```
slicehub_backend/
├── app.ts                          # Точка входа приложения
├── conf.json                       # Конфигурация (БД, порты, настройки)
│
├── config/                         # Типы конфигурации
│
├── db/
│   ├── init.ts                    # Инициализация БД
│   ├── sequelize/
│   │   ├── index.ts               # Подключение к PostgreSQL
│   │   ├── sync.ts                # Синхронизация схемы
│   │   ├── models/                # Sequelize модели (таблицы)
│   │   └── seeds/                 # Начальные данные (справочники)
│   └── migrations/
│       ├── runner.ts              # Запуск миграций
│       └── migrationsFiles/       # Ручные миграции БД
│
├── src/
│   ├── routes/
│   │   ├── api/                   # REST API контроллеры
│   │   │   ├── users/
│   │   │   ├── models-3d/
│   │   │   ├── collections/
│   │   │   └── ...
│   │   └── monitoring/            # Мониторинг CPU/Memory
│   ├── swagger/                   # Swagger документация
│   ├── middlewares/               # Middleware
│   ├── services/                  # Бизнес-логика
│   └── types/                     # TypeScript типы
│
├── sys/logger/                    # Логирование (log4js)
├── logs/                          # Файлы логов
└── dist/                          # Собранное приложение
```

## Основные файлы

| Файл/Папка | Назначение |
|------------| -----------|
| `conf.json` | Конфигурация БД, порты, настройки |
| `db/sequelize/index.ts` | Подключение к PostgreSQL |
| `db/sequelize/models/` | Модели Sequelize (таблицы) |
| `db/sequelize/seeds/` | Начальные данные |
| `db/migrations/migrationsFiles/` | Ручные миграции |
| `src/routes/api/` | REST API контроллеры |
| `sys/logger/` | Настройка логирования |

## Конфигурация БД

В `conf.json` указывается какую БД использовать:

```json
{
  "settings": {
    "database": "mainpc_docker_pg"  // или "slicehub_postgres"
  },
  "DB": {
    "mainpc_docker_pg": {
      "host": "localhost",
      "port": 5431,
      ...
    }
  }
}
```

## API

- REST API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`
- Мониторинг: `http://localhost:3000/monitoring/ui`

## Seeds (Начальные данные)

Seeds заполняют базу данных начальными данными. Они разделены на две категории:

### Default Seeds (Справочники)

Выполняются **автоматически при каждом запуске** приложения:
- Роли (`admin`, `moderator`, `user`)
- Статусы пользователей (`active`, `banned`, `pending`)
- Типы файлов, лицензии, категории, теги, и т.д.

Используют `bulkCreate` с `ignoreDuplicates: true`, поэтому дублирования не происходит.

### Mock Seeds (Тестовые данные)

Генерируют тестовых пользователей, модели, коллекции, комментарии. **Управляются через `conf.json`:**

```json
{
  "settings": {
    "sync": {
      "mockSeeding": {
        "enableMockSeeds": false,      // Включить/выключить
        "mockSeedsRunCount": 1          // Сколько раз запустить (50 юзеров × N)
      }
    }
  }
}
```

**Использование:**

1. **Первый запуск с тестовыми данными:**
   ```json
   "enableMockSeeds": true,
   "mockSeedsRunCount": 1
   ```
   Создаст 50 пользователей с моделями, коллекциями, комментариями.

2. **Генерация большого количества данных:**
   ```json
   "enableMockSeeds": true,
   "mockSeedsRunCount": 3    // 50 × 3 = 150 пользователей
   ```

3. **Продакшен (без тестовых данных):**
   ```json
   "enableMockSeeds": false
   ```

> ⚠️ **Автоотключение:** После успешного выполнения mock seeds автоматически устанавливается `enableMockSeeds: false` в `conf.json`, чтобы предотвратить повторную генерацию при следующем запуске.

Подробнее: [db/sequelize/seeds/README.md](db/sequelize/seeds/README.md)

## Миграции БД

### Создание новой миграции

Используйте встроенный генератор для создания файла миграции:

```bash
npm run migration:create "add user avatar"
```

Это создаст файл `db/migrations/migrationsFiles/XXX-add-user-avatar.ts` с шаблоном:

```typescript
export const up = async (queryInterface: QueryInterface): Promise<void> => {
    // TODO: Добавьте код миграции здесь
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    // TODO: Добавьте код отката здесь
};
```

### Регистрация миграции

После создания файла добавьте миграцию в `db/migrations/index.ts`:

```typescript
// 1. Импорт
import migration003 from "./migrationsFiles/003-add-user-avatar";

// 2. Регистрация
const migrationsRegistry: { [key: number]: Migration } = {
    1: migration001,
    2: migration002,
    3: migration003,  // <-- добавить
};
```

### Запуск миграций

Миграции выполняются автоматически при старте приложения (`npm run dev` или `npm start`).

Для ручного управления используйте методы в `db/migrations/runner.ts`:
- `runMigrations()` - выполнить все новые миграции
- `rollbackMigrations()` - откатить последнюю миграцию
- `showMigrationStatus()` - показать статус

## Скрипты

```bash
npm run dev              # Разработка с hot-reload
npm run build            # Сборка (webpack)
npm start                # Запуск собранного приложения
npm run lint             # Проверка кода
npm run lint:fix         # Автоисправление
npm run migration:create # Создать новую миграцию
```

## Docker Compose

### Быстрый старт с Docker

```bash
# Запустить все сервисы (PostgreSQL, Redis, MinIO, NATS, App)
docker-compose up -d

# Проверить статус
docker-compose ps

# Просмотр логов
docker-compose logs -f app
```

### Доступные сервисы

| Сервис | Порт | Описание |
|--------|------|----------|
| Backend API | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | База данных |
| Redis | 6379 | Кэш и очереди |
| MinIO S3 API | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | http://localhost:9001 |
| NATS | 4222 | Messaging |

### S3 Хранилище (MinIO)

MinIO предоставляет S3-совместимое хранилище для файлов:

**Доступ к Web Console:**
- URL: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

**Автоматически созданные бакеты:**
- `slicehub-models` - 3D модели
- `slicehub-previews` - Превью изображения
- `slicehub-avatars` - Аватары пользователей
- `slicehub-attachments` - Вложения

**Использование в коде:**

```typescript
import { s3StorageService } from './services';

// Загрузить файл
await s3StorageService.uploadFile('models', 'path/to/file.stl', buffer);

// Скачать файл
const data = await s3StorageService.downloadFile('models', 'path/to/file.stl');

// Получить временную ссылку
const url = await s3StorageService.getPresignedUrl('models', 'path/to/file.stl', 3600);
```

📖 **Документация:**
- [Руководство по S3 хранилищу](docs/S3_STORAGE_GUIDE.md)
- [Примеры использования S3 API](docs/S3_API_EXAMPLE.md)
- [API для загрузки файлов моделей](docs/MODEL_FILES_API.md) ⭐
- [Развертывание с Docker](docs/DOCKER_DEPLOYMENT.md)

## Стек

Node.js • TypeScript • Express • Sequelize • PostgreSQL • Redis • MinIO (S3) • NATS • Swagger • log4js • Docker
