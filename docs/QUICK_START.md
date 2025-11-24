# Быстрый старт SliceHub Backend

## 🚀 Запуск за 5 минут

### Шаг 1: Установка зависимостей

```bash
npm install
```

### Шаг 2: Запуск Docker Compose

```bash
docker-compose up -d
```

Это запустит:
- ✅ PostgreSQL (база данных)
- ✅ Redis (кэш)
- ✅ MinIO (S3 хранилище)
- ✅ NATS (messaging)
- ✅ Backend приложение

### Шаг 3: Проверка статуса

```bash
docker-compose ps
```

Все сервисы должны быть в статусе "Up" и "healthy".

### Шаг 4: Проверка API

Откройте в браузере:
- API: http://localhost:3001
- Swagger: http://localhost:3001/api-docs
- MinIO Console: http://localhost:9001

## 📦 Что было автоматически настроено?

### База данных (PostgreSQL)

✅ Создана база данных `slicehub`  
✅ Созданы все таблицы  
✅ Выполнены миграции  
✅ Загружены начальные данные (роли, статусы, типы файлов, лицензии и т.д.)

### S3 Хранилище (MinIO)

✅ Создан контейнер MinIO  
✅ Автоматически созданы бакеты:
  - `slicehub-models` (3D модели)
  - `slicehub-previews` (превью)
  - `slicehub-avatars` (аватары)
  - `slicehub-attachments` (вложения)

**Доступ к MinIO Console:**
- URL: http://localhost:9001
- Логин: `minioadmin`
- Пароль: `minioadmin`

### Redis

✅ Запущен и готов к использованию на порту 6379

### NATS

✅ Запущен и готов к использованию на порту 4222

## 🎯 Основные команды

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f app

# Только база данных
docker-compose logs -f postgres

# Только MinIO
docker-compose logs -f minio
```

### Перезапуск сервиса

```bash
# Перезапустить все
docker-compose restart

# Перезапустить только backend
docker-compose restart app
```

### Остановка

```bash
# Остановить без удаления
docker-compose stop

# Остановить и удалить контейнеры (данные сохраняются)
docker-compose down
```

### Пересборка после изменений кода

```bash
docker-compose up -d --build app
```

## 🧪 Тестовые данные

### Включить генерацию тестовых данных

Отредактируйте `conf.json`:

```json
{
  "settings": {
    "sync": {
      "mockSeeding": {
        "enableMockSeeds": true,
        "mockSeedsRunCount": 1
      }
    }
  }
}
```

Затем перезапустите приложение:

```bash
docker-compose restart app
```

Это создаст:
- 50 тестовых пользователей
- 3D модели с файлами
- Коллекции
- Комментарии и рейтинги

> ⚠️ После выполнения `enableMockSeeds` автоматически сбросится в `false`

## 🔍 Проверка работоспособности

### 1. Healthcheck API

```bash
curl http://localhost:3001/monitoring/healthcheck
```

Ответ должен быть:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 2. Проверка базы данных

```bash
docker-compose exec postgres psql -U slicehub_user -d slicehub -c "SELECT COUNT(*) FROM slicehub.users;"
```

### 3. Проверка MinIO

```bash
curl http://localhost:9000/minio/health/live
```

### 4. Проверка Redis

```bash
docker-compose exec redis redis-cli ping
```

Ответ: `PONG`

## 🎨 Примеры использования S3

### Через код

```typescript
import { s3StorageService } from './services';

// Загрузить файл
const fileBuffer = Buffer.from('test data');
await s3StorageService.uploadFile('models', 'test.stl', fileBuffer);

// Скачать файл
const data = await s3StorageService.downloadFile('models', 'test.stl');

// Получить временную ссылку (действует 1 час)
const url = await s3StorageService.getPresignedUrl('models', 'test.stl', 3600);

// Удалить файл
await s3StorageService.deleteFile('models', 'test.stl');
```

### Через MinIO Console

1. Откройте http://localhost:9001
2. Войдите (minioadmin / minioadmin)
3. Выберите бакет (например, `slicehub-models`)
4. Загружайте, скачивайте, удаляйте файлы через UI

### Через MinIO Client (mc)

```bash
# Настроить алиас
docker run --rm --network slicehub_backend_default minio/mc alias set local http://minio:9000 minioadmin minioadmin

# Список бакетов
docker run --rm --network slicehub_backend_default minio/mc ls local

# Список файлов в бакете
docker run --rm --network slicehub_backend_default minio/mc ls local/slicehub-models

# Загрузить файл
docker run --rm --network slicehub_backend_default -v $(pwd):/data minio/mc cp /data/file.stl local/slicehub-models/
```

## 🐛 Проблемы?

### Порты уже заняты

Если порты 3001, 5432, 6379, 9000 или 9001 заняты, измените их в `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3002:3001"  # Внешний порт : Внутренний порт
```

### MinIO не создал бакеты

Вручную запустите скрипт инициализации:

```bash
docker-compose up minio-init
```

### База данных не подключается

Проверьте, что PostgreSQL запущен и здоров:

```bash
docker-compose ps postgres
docker-compose logs postgres
```

### Приложение не запускается

Проверьте логи:

```bash
docker-compose logs app
```

## 📚 Дополнительная документация

- [Руководство по S3 хранилищу](S3_STORAGE_GUIDE.md)
- [Примеры API для работы с S3](S3_API_EXAMPLE.md)
- [Полное руководство по Docker Compose](DOCKER_DEPLOYMENT.md)
- [Основной README](../README.MD)

## 🎓 Следующие шаги

1. Изучите Swagger документацию: http://localhost:3001/api-docs
2. Посмотрите примеры в `docs/S3_API_EXAMPLE.md`
3. Добавьте свои эндпоинты в `src/routes/api/`
4. Создайте миграции: `npm run migration:create "название"`

## 💡 Полезные советы

### Режим разработки (без Docker)

Если хотите запустить приложение локально без Docker:

```bash
# 1. Запустить только инфраструктуру (БД, Redis, MinIO)
docker-compose up -d postgres redis minio minio-init

# 2. Изменить в conf.json host на localhost
# "host": "localhost" вместо "host": "postgres"

# 3. Запустить приложение
npm run dev
```

### Очистка данных

```bash
# Удалить все контейнеры и volumes (ОСТОРОЖНО!)
docker-compose down -v

# Пересоздать всё с нуля
docker-compose up -d
```

### Backup данных

```bash
# PostgreSQL
docker-compose exec postgres pg_dump -U slicehub_user slicehub > backup.sql

# MinIO (все бакеты)
docker run --rm --network slicehub_backend_default -v $(pwd)/backup:/backup minio/mc mirror local /backup
```

---

**Готово!** 🎉 Ваш backend запущен и готов к работе!

