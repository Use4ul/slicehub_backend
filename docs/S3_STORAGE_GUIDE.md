# Руководство по работе с S3 хранилищем

## Обзор

В проекте SliceHub используется MinIO - S3-совместимое объектное хранилище для хранения файлов (моделей, превью, аватаров, вложений).

## Конфигурация

### Docker Compose

MinIO настроен в `docker-compose.yml`:

```yaml
minio:
  image: minio/minio:latest
  ports:
    - "9000:9000"  # API endpoint
    - "9001:9001"  # Web Console
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
```

### Доступ к MinIO Console

После запуска docker-compose, MinIO Console будет доступен по адресу:
- URL: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

### Конфигурация приложения

Настройки S3 хранятся в `conf.json`:

```json
{
  "s3": {
    "endpoint": "http://localhost:9000",
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

### Переменные окружения

Для Docker окружения используются переменные окружения:

```bash
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
```

## Использование S3StorageService

### Импорт сервиса

```typescript
import { s3StorageService } from '../services';
```

### Загрузка файла

```typescript
// Загрузка модели
const fileBuffer = await fs.readFile('model.stl');
const path = await s3StorageService.uploadFile(
  'models',
  `user-123/my-model.stl`,
  fileBuffer,
  'application/octet-stream'
);

// Загрузка изображения
const imageBuffer = await fs.readFile('preview.jpg');
const imagePath = await s3StorageService.uploadFile(
  'previews',
  `model-456/preview.jpg`,
  imageBuffer,
  'image/jpeg'
);
```

### Скачивание файла

```typescript
const fileBuffer = await s3StorageService.downloadFile('models', 'user-123/my-model.stl');
```

### Удаление файла

```typescript
await s3StorageService.deleteFile('models', 'user-123/my-model.stl');
```

### Проверка существования файла

```typescript
const exists = await s3StorageService.fileExists('models', 'user-123/my-model.stl');
if (exists) {
  console.log('File exists');
}
```

### Получение временной ссылки на скачивание

```typescript
// Ссылка действительна 1 час (по умолчанию)
const url = await s3StorageService.getPresignedUrl('models', 'user-123/my-model.stl');

// Ссылка действительна 24 часа
const url24h = await s3StorageService.getPresignedUrl('models', 'user-123/my-model.stl', 86400);
```

### Получение публичного URL

```typescript
// Для публичных бакетов (previews, avatars)
const publicUrl = s3StorageService.getPublicUrl('previews', 'model-456/preview.jpg');
```

### Список файлов

```typescript
// Все файлы в бакете
const allFiles = await s3StorageService.listFiles('models');

// Файлы с определенным префиксом
const userFiles = await s3StorageService.listFiles('models', 'user-123/');
```

## Типы бакетов

- `models` - 3D модели (.stl, .obj, .3mf и т.д.)
- `previews` - Превью изображения моделей (публичный доступ)
- `avatars` - Аватары пользователей (публичный доступ)
- `attachments` - Вложения к комментариям

## Пример использования в контроллере

```typescript
import { Post, UploadedFile } from 'routing-controllers';
import { s3StorageService } from '../services';

@Post('/upload')
async uploadModel(@UploadedFile('file') file: Express.Multer.File) {
  const key = `${userId}/${Date.now()}-${file.originalname}`;
  
  const path = await s3StorageService.uploadFile(
    'models',
    key,
    file.buffer,
    file.mimetype
  );
  
  return { path, key };
}
```

## Запуск

### Первый запуск

```bash
# Установить зависимости
npm install

# Запустить все сервисы
docker-compose up -d

# MinIO автоматически создаст все необходимые бакеты
```

### Проверка работоспособности

```bash
# Проверить статус контейнеров
docker-compose ps

# Проверить логи MinIO
docker-compose logs minio

# Проверить логи инициализации
docker-compose logs minio-init
```

## Troubleshooting

### MinIO недоступен

Проверьте, что контейнер запущен:
```bash
docker-compose ps minio
```

Проверьте логи:
```bash
docker-compose logs minio
```

### Бакеты не созданы

Вручную запустите скрипт инициализации:
```bash
docker-compose up minio-init
```

### Ошибки подключения из приложения

Убедитесь, что используется правильный endpoint:
- Внутри Docker: `http://minio:9000`
- Снаружи Docker: `http://localhost:9000`

## Production настройки

Для production окружения рекомендуется:

1. Изменить дефолтные credentials:
```yaml
environment:
  MINIO_ROOT_USER: your_secure_username
  MINIO_ROOT_PASSWORD: your_secure_password_min_8_chars
```

2. Использовать постоянное хранилище:
```yaml
volumes:
  - /path/to/data:/data
```

3. Настроить HTTPS и SSL сертификаты

4. Настроить backup политику для данных

5. Ограничить доступ к портам через firewall

6. Использовать внешний S3 (AWS, Yandex Cloud) вместо MinIO

