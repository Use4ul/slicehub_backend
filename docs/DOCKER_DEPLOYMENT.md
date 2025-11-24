# Развертывание SliceHub с Docker Compose

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd slicehub_backend
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка конфигурации

Убедитесь, что `conf.json` содержит правильные настройки для Docker окружения:

```json
{
  "settings": {
    "database": "slicehub_postgres"
  },
  "db": {
    "slicehub_postgres": {
      "host": "postgres",
      "port": 5432,
      "database": "slicehub",
      "user": "slicehub_user"
    }
  },
  "s3": {
    "endpoint": "http://minio:9000",
    "region": "us-east-1",
    "accessKeyId": "minioadmin",
    "secretAccessKey": "minioadmin",
    "buckets": {
      "models": "slicehub-models",
      "previews": "slicehub-previews",
      "avatars": "slicehub-avatars",
      "attachments": "slicehub-attachments"
    },
    "forcePathStyle": true
  }
}
```

### 4. Запуск Docker Compose

```bash
# Development mode
docker-compose up -d

# Production mode
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Проверка статуса

```bash
docker-compose ps
```

Все сервисы должны быть в статусе "Up" и "healthy".

## Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │PostgreSQL│  │  Redis   │  │  MinIO   │             │
│  │  :5432   │  │  :6379   │  │  :9000   │             │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘             │
│        │             │             │                   │
│        └─────────────┴─────────────┘                   │
│                      │                                 │
│                ┌─────▼─────┐                           │
│                │           │                           │
│                │   App     │                           │
│                │  :3001    │                           │
│                │           │                           │
│                └─────┬─────┘                           │
│                      │                                 │
└──────────────────────┼─────────────────────────────────┘
                       │
                   Internet
```

## Доступные сервисы

| Сервис | Порт | Описание | URL |
|--------|------|----------|-----|
| App | 3001 | Backend API | http://localhost:3001 |
| PostgreSQL | 5432 | База данных | localhost:5432 |
| Redis | 6379 | Кэш и очереди | localhost:6379 |
| MinIO API | 9000 | S3 API | http://localhost:9000 |
| MinIO Console | 9001 | Web интерфейс MinIO | http://localhost:9001 |
| NATS | 4222 | Messaging | nats://localhost:4222 |
| NATS Monitoring | 8222 | NATS мониторинг | http://localhost:8222 |

## Работа с MinIO

### Доступ к Web Console

1. Откройте http://localhost:9001
2. Логин: `minioadmin`
3. Пароль: `minioadmin`

### Автоматическое создание бакетов

При первом запуске автоматически создаются следующие бакеты:
- `slicehub-models` - хранилище 3D моделей (приватное)
- `slicehub-previews` - превью изображения (публичное)
- `slicehub-avatars` - аватары пользователей (публичное)
- `slicehub-attachments` - вложения к комментариям (приватное)

### Ручное создание бакетов

Если бакеты не создались автоматически:

```bash
# Запустить скрипт инициализации
docker-compose up minio-init

# Или создать вручную через Web Console
```

## Управление контейнерами

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f minio
```

### Перезапуск сервисов

```bash
# Все сервисы
docker-compose restart

# Конкретный сервис
docker-compose restart app
```

### Остановка

```bash
# Остановить без удаления
docker-compose stop

# Остановить и удалить контейнеры (данные сохраняются)
docker-compose down

# Остановить и удалить всё включая volumes (ОСТОРОЖНО!)
docker-compose down -v
```

### Пересборка

```bash
# Пересобрать приложение
docker-compose build app

# Пересобрать и запустить
docker-compose up -d --build app
```

## Миграции базы данных

### Запуск миграций

```bash
# Войти в контейнер
docker-compose exec app sh

# Запустить миграции
npm run migrate

# Или напрямую
docker-compose exec app npm run migrate
```

### Создание новой миграции

```bash
docker-compose exec app npm run migration:create
```

## Backup и восстановление

### PostgreSQL

#### Создание backup

```bash
docker-compose exec postgres pg_dump -U slicehub_user slicehub > backup.sql
```

#### Восстановление

```bash
docker-compose exec -T postgres psql -U slicehub_user slicehub < backup.sql
```

### MinIO (S3 данные)

#### Создание backup

```bash
# Backup всех бакетов
docker run --rm \
  --network slicehub_backend_default \
  -v $(pwd)/backup:/backup \
  minio/mc mirror slicehub /backup
```

#### Восстановление

```bash
docker run --rm \
  --network slicehub_backend_default \
  -v $(pwd)/backup:/backup \
  minio/mc mirror /backup slicehub
```

## Мониторинг

### Проверка здоровья сервисов

```bash
# Статус всех контейнеров
docker-compose ps

# Детальная информация
docker-compose exec app node -e "require('http').get('http://localhost:3001/monitoring/healthcheck')"
```

### Использование ресурсов

```bash
# CPU и память
docker stats

# Только для проекта
docker stats $(docker-compose ps -q)
```

## Troubleshooting

### Проблема: Контейнер не запускается

```bash
# Проверить логи
docker-compose logs <service-name>

# Проверить конфигурацию
docker-compose config
```

### Проблема: Нет подключения к базе данных

```bash
# Проверить, что PostgreSQL запущен и здоров
docker-compose ps postgres

# Проверить подключение
docker-compose exec postgres psql -U slicehub_user -d slicehub -c "SELECT 1"

# Проверить логи
docker-compose logs postgres
```

### Проблема: MinIO недоступен

```bash
# Проверить статус
docker-compose ps minio

# Проверить healthcheck
docker inspect slicehub_minio --format='{{.State.Health.Status}}'

# Проверить логи
docker-compose logs minio

# Проверить доступность API
curl http://localhost:9000/minio/health/live
```

### Проблема: Файлы не загружаются в S3

1. Проверьте, что MinIO запущен и здоров
2. Проверьте, что бакеты созданы (зайдите в Web Console)
3. Проверьте логи приложения на наличие ошибок S3
4. Убедитесь, что credentials корректны

```bash
# Проверить бакеты
docker run --rm \
  --network slicehub_backend_default \
  minio/mc alias set test http://minio:9000 minioadmin minioadmin

docker run --rm \
  --network slicehub_backend_default \
  minio/mc ls test
```

### Проблема: Порты уже заняты

Измените порты в `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3002:3001"  # Вместо 3001:3001
```

## Production рекомендации

### 1. Безопасность

```yaml
# Измените дефолтные пароли!
environment:
  POSTGRES_PASSWORD: <strong-password>
  MINIO_ROOT_USER: <custom-username>
  MINIO_ROOT_PASSWORD: <strong-password>
```

### 2. Volumes для данных

```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/postgres-data

  minio_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/minio-data
```

### 3. Ограничение ресурсов

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 4. Логирование

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. Автоматический перезапуск

```yaml
services:
  app:
    restart: always
```

### 6. Health checks

Все сервисы уже имеют настроенные health checks. Убедитесь, что они работают:

```bash
docker-compose ps
```

### 7. Reverse Proxy (Nginx)

Для production рекомендуется использовать Nginx:

```nginx
upstream backend {
    server localhost:3001;
}

server {
    listen 80;
    server_name api.slicehub.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Обновление

### Обновление приложения

```bash
# Получить последние изменения
git pull

# Установить зависимости
npm install

# Пересобрать и перезапустить
docker-compose up -d --build app
```

### Обновление образов

```bash
# Обновить все образы
docker-compose pull

# Перезапустить с новыми образами
docker-compose up -d
```

