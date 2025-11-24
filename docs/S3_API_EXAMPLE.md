# Примеры использования S3StorageService

## Базовые операции

### 1. Загрузка файла модели

```typescript
import { s3StorageService } from '../services';
import { v4 as uuidv4 } from 'uuid';

async function uploadModelFile(userId: number, file: Buffer, filename: string) {
  const fileId = uuidv4();
  const key = `user-${userId}/${fileId}/${filename}`;
  
  const path = await s3StorageService.uploadFile(
    'models',
    key,
    file,
    'application/octet-stream'
  );
  
  return {
    fileId,
    path,
    key
  };
}
```

### 2. Загрузка превью изображения

```typescript
async function uploadPreview(modelId: number, previewNumber: number, imageBuffer: Buffer) {
  const key = `model-${modelId}/preview-${previewNumber}.jpg`;
  
  const path = await s3StorageService.uploadFile(
    'previews',
    key,
    imageBuffer,
    'image/jpeg'
  );
  
  return s3StorageService.getPublicUrl('previews', key);
}
```

### 3. Загрузка аватара пользователя

```typescript
async function updateUserAvatar(userId: number, imageBuffer: Buffer) {
  const key = `user-${userId}.jpg`;
  
  // Удаляем старый аватар, если существует
  const exists = await s3StorageService.fileExists('avatars', key);
  if (exists) {
    await s3StorageService.deleteFile('avatars', key);
  }
  
  // Загружаем новый
  await s3StorageService.uploadFile(
    'avatars',
    key,
    imageBuffer,
    'image/jpeg'
  );
  
  return s3StorageService.getPublicUrl('avatars', key);
}
```

## Продвинутые операции

### 4. Массовая загрузка файлов

```typescript
async function uploadMultipleFiles(
  userId: number,
  files: Array<{ buffer: Buffer; filename: string; mimetype: string }>
) {
  const uploadPromises = files.map(async (file) => {
    const key = `user-${userId}/${Date.now()}-${file.filename}`;
    return s3StorageService.uploadFile(
      'models',
      key,
      file.buffer,
      file.mimetype
    );
  });
  
  return Promise.all(uploadPromises);
}
```

### 5. Получение временной ссылки для скачивания

```typescript
async function getDownloadLink(modelId: number, filename: string) {
  const key = `model-${modelId}/${filename}`;
  
  // Проверяем существование файла
  const exists = await s3StorageService.fileExists('models', key);
  if (!exists) {
    throw new Error('File not found');
  }
  
  // Ссылка действительна 1 час
  return s3StorageService.getPresignedUrl('models', key, 3600);
}
```

### 6. Получение всех файлов модели

```typescript
async function getModelFiles(modelId: number) {
  const prefix = `model-${modelId}/`;
  
  const files = await s3StorageService.listFiles('models', prefix);
  
  return files.map(key => ({
    key,
    filename: key.replace(prefix, ''),
    url: s3StorageService.getPublicUrl('models', key)
  }));
}
```

### 7. Копирование файла между бакетами

```typescript
async function moveToArchive(modelId: number, filename: string) {
  const sourceKey = `model-${modelId}/${filename}`;
  
  // Скачиваем
  const fileBuffer = await s3StorageService.downloadFile('models', sourceKey);
  
  // Загружаем в архив
  const archiveKey = `archive/${modelId}/${filename}`;
  await s3StorageService.uploadFile('attachments', archiveKey, fileBuffer);
  
  // Удаляем оригинал
  await s3StorageService.deleteFile('models', sourceKey);
  
  return archiveKey;
}
```

### 8. Удаление всех файлов модели

```typescript
async function deleteModelFiles(modelId: number) {
  const prefix = `model-${modelId}/`;
  
  // Получаем список всех файлов
  const files = await s3StorageService.listFiles('models', prefix);
  
  // Удаляем все файлы
  const deletePromises = files.map(key => 
    s3StorageService.deleteFile('models', key)
  );
  
  await Promise.all(deletePromises);
}
```

## Интеграция с Express/routing-controllers

### 9. Контроллер для загрузки модели

```typescript
import { Post, UploadedFile, Body, Authorized } from 'routing-controllers';
import { s3StorageService } from '../services';

@Authorized()
@Post('/models/upload')
async uploadModel(
  @UploadedFile('file') file: Express.Multer.File,
  @Body() body: { name: string; description: string }
) {
  // Валидация
  if (!file) {
    throw new Error('File is required');
  }
  
  const allowedTypes = ['model/stl', 'application/sla', 'application/octet-stream'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }
  
  // Загружаем файл
  const userId = 123; // Получить из текущего пользователя
  const key = `user-${userId}/${Date.now()}-${file.originalname}`;
  
  const path = await s3StorageService.uploadFile(
    'models',
    key,
    file.buffer,
    file.mimetype
  );
  
  // Сохраняем в БД
  // ...
  
  return {
    success: true,
    path,
    key,
    size: file.size
  };
}
```

### 10. Контроллер для скачивания файла

```typescript
import { Get, Param, Res, HttpError } from 'routing-controllers';
import { Response } from 'express';
import { s3StorageService } from '../services';

@Get('/models/:id/download/:filename')
async downloadModel(
  @Param('id') modelId: number,
  @Param('filename') filename: string,
  @Res() response: Response
) {
  const key = `model-${modelId}/${filename}`;
  
  // Проверяем существование
  const exists = await s3StorageService.fileExists('models', key);
  if (!exists) {
    throw new HttpError(404, 'File not found');
  }
  
  // Скачиваем
  const fileBuffer = await s3StorageService.downloadFile('models', key);
  
  // Отправляем клиенту
  response.setHeader('Content-Type', 'application/octet-stream');
  response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  response.send(fileBuffer);
  
  return response;
}
```

### 11. Контроллер для получения временной ссылки

```typescript
import { Get, Param, QueryParam, Authorized } from 'routing-controllers';
import { s3StorageService } from '../services';

@Authorized()
@Get('/models/:id/download-link')
async getDownloadLink(
  @Param('id') modelId: number,
  @QueryParam('filename') filename: string,
  @QueryParam('expires') expires: number = 3600
) {
  const key = `model-${modelId}/${filename}`;
  
  const exists = await s3StorageService.fileExists('models', key);
  if (!exists) {
    throw new Error('File not found');
  }
  
  const url = await s3StorageService.getPresignedUrl('models', key, expires);
  
  return {
    url,
    expiresIn: expires,
    expiresAt: new Date(Date.now() + expires * 1000)
  };
}
```

## Обработка ошибок

```typescript
async function safeUpload(bucketType: BucketType, key: string, data: Buffer) {
  try {
    const path = await s3StorageService.uploadFile(bucketType, key, data);
    return { success: true, path };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: error.message };
  }
}

async function safeDelete(bucketType: BucketType, key: string) {
  try {
    await s3StorageService.deleteFile(bucketType, key);
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    // В случае удаления, возможно файл уже не существует
    return { success: false, error: error.message };
  }
}
```

## Тестирование

```typescript
import { s3StorageService } from '../services';

describe('S3StorageService', () => {
  it('should upload and download file', async () => {
    const testData = Buffer.from('test content');
    const key = 'test/file.txt';
    
    // Upload
    await s3StorageService.uploadFile('attachments', key, testData, 'text/plain');
    
    // Check exists
    const exists = await s3StorageService.fileExists('attachments', key);
    expect(exists).toBe(true);
    
    // Download
    const downloaded = await s3StorageService.downloadFile('attachments', key);
    expect(downloaded.toString()).toBe('test content');
    
    // Delete
    await s3StorageService.deleteFile('attachments', key);
    
    // Check not exists
    const stillExists = await s3StorageService.fileExists('attachments', key);
    expect(stillExists).toBe(false);
  });
});
```

