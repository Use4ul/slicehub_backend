# Model Files API - Работа с файлами 3D моделей

## 📦 Обзор

API для загрузки, скачивания и управления файлами 3D моделей через S3 хранилище.

**Базовый URL:** `/api/model-files`

---

## 🚀 Endpoints

### 1. Загрузить файл модели

**POST** `/api/model-files/upload`

Загружает файл 3D модели в S3 и сохраняет метаданные в БД.

**Content-Type:** `multipart/form-data`

**Параметры:**

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `file` | File | Да | Файл модели (.stl, .obj, .3mf, .sla, .gcode) |
| `model_id` | UUID | Да | ID модели |
| `file_type_id` | Integer | Да | ID типа файла |
| `uploaded_by` | UUID | Да | ID пользователя |
| `is_primary` | Boolean | Нет | Основной файл модели (по умолчанию: false) |

**Ограничения:**
- Максимальный размер файла: 500 MB
- Разрешенные форматы: STL, OBJ, 3MF, SLA, GCODE

**Пример запроса (cURL):**

```bash
curl -X POST http://localhost:3000/api/model-files/upload \
  -F "file=@model.stl" \
  -F "model_id=550e8400-e29b-41d4-a716-446655440000" \
  -F "file_type_id=1" \
  -F "uploaded_by=650e8400-e29b-41d4-a716-446655440000" \
  -F "is_primary=true"
```

**Пример запроса (JavaScript):**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('model_id', '550e8400-e29b-41d4-a716-446655440000');
formData.append('file_type_id', '1');
formData.append('uploaded_by', currentUserId);
formData.append('is_primary', 'true');

const response = await fetch('http://localhost:3000/api/model-files/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

**Ответ (201 Created):**

```json
{
  "success": true,
  "file": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "model_id": "550e8400-e29b-41d4-a716-446655440000",
    "file_type_id": 1,
    "original_filename": "dragon_model.stl",
    "file_size": 15728640,
    "storage_type_id": 2,
    "storage_path": "model-550e8400-e29b-41d4-a716-446655440000/1732000000000-a1b2c3d4e5f6g7h8.stl",
    "checksum_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "download_count": 0,
    "is_primary": true,
    "is_published": true,
    "created_at": "2025-11-18T12:00:00.000Z",
    "uploaded_by": "650e8400-e29b-41d4-a716-446655440000"
  },
  "message": "File uploaded successfully"
}
```

---

### 2. Скачать файл

**GET** `/api/model-files/:id/download`

Скачивает файл из S3 и автоматически увеличивает счетчик скачиваний.

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `id` | UUID | ID файла |

**Пример запроса:**

```bash
curl -X GET http://localhost:3000/api/model-files/7c9e6679-7425-40de-944b-e07fc1f90ae7/download \
  -o downloaded_model.stl
```

**Пример запроса (JavaScript):**

```javascript
const response = await fetch(
  `http://localhost:3000/api/model-files/${fileId}/download`
);

if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'model.stl';
  a.click();
}
```

**Ответ:**
- Content-Type: `application/octet-stream`
- Content-Disposition: `attachment; filename="dragon_model.stl"`
- Body: Бинарные данные файла

---

### 3. Получить временную ссылку на скачивание

**GET** `/api/model-files/:id/download-link`

Генерирует предподписанную временную ссылку для скачивания файла из S3.

**Параметры URL:**

| Параметр | Тип | Обязательное | Описание |
|----------|-----|--------------|----------|
| `id` | UUID | Да | ID файла |

**Query параметры:**

| Параметр | Тип | Описание | По умолчанию |
|----------|-----|----------|--------------|
| `expires` | Integer | Время жизни ссылки (секунды) | 3600 (1 час) |

**Пример запроса:**

```bash
# Ссылка на 1 час
curl -X GET http://localhost:3000/api/model-files/7c9e6679-7425-40de-944b-e07fc1f90ae7/download-link

# Ссылка на 24 часа
curl -X GET "http://localhost:3000/api/model-files/7c9e6679-7425-40de-944b-e07fc1f90ae7/download-link?expires=86400"
```

**Пример запроса (JavaScript):**

```javascript
const response = await fetch(
  `http://localhost:3000/api/model-files/${fileId}/download-link?expires=3600`
);

const data = await response.json();
console.log('Download URL:', data.url);
console.log('Expires at:', data.expires_at);

// Использовать ссылку
window.open(data.url, '_blank');
```

**Ответ (200 OK):**

```json
{
  "url": "http://localhost:9000/slicehub-models/model-550e8400.../dragon_model.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "expires_in": 3600,
  "expires_at": "2025-11-18T13:00:00.000Z",
  "filename": "dragon_model.stl"
}
```

---

### 4. Получить все файлы модели

**GET** `/api/model-files/model/:modelId`

Получает список всех файлов конкретной модели.

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `modelId` | UUID | ID модели |

**Пример запроса:**

```bash
curl -X GET http://localhost:3000/api/model-files/model/550e8400-e29b-41d4-a716-446655440000
```

**Ответ (200 OK):**

```json
[
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "model_id": "550e8400-e29b-41d4-a716-446655440000",
    "original_filename": "dragon_model.stl",
    "file_size": 15728640,
    "is_primary": true,
    "download_count": 42,
    "file_type": {
      "id": 1,
      "name": "STL",
      "extension": ".stl"
    },
    "storage_type": {
      "id": 2,
      "name": "s3"
    }
  },
  {
    "id": "8d9f7789-8536-51ef-b827-f18gd2g91bf8",
    "model_id": "550e8400-e29b-41d4-a716-446655440000",
    "original_filename": "dragon_model.obj",
    "file_size": 8912340,
    "is_primary": false,
    "download_count": 15,
    "file_type": {
      "id": 2,
      "name": "OBJ",
      "extension": ".obj"
    }
  }
]
```

---

### 5. Получить все файлы

**GET** `/api/model-files`

Получает список всех файлов в системе.

**Пример запроса:**

```bash
curl -X GET http://localhost:3000/api/model-files
```

**Ответ (200 OK):** Массив всех файлов с метаданными.

---

### 6. Получить файл по ID

**GET** `/api/model-files/:id`

Получает метаданные файла по ID.

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `id` | UUID | ID файла |

**Пример запроса:**

```bash
curl -X GET http://localhost:3000/api/model-files/7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Ответ (200 OK):**

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "model_id": "550e8400-e29b-41d4-a716-446655440000",
  "file_type_id": 1,
  "original_filename": "dragon_model.stl",
  "file_size": 15728640,
  "storage_type_id": 2,
  "storage_path": "model-550e8400.../1732000000000-a1b2c3d4.stl",
  "checksum_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "download_count": 42,
  "is_primary": true,
  "is_published": true,
  "created_at": "2025-11-18T12:00:00.000Z",
  "uploaded_by": "650e8400-e29b-41d4-a716-446655440000",
  "file_type": {
    "id": 1,
    "name": "STL"
  },
  "storage_type": {
    "id": 2,
    "name": "s3"
  },
  "model": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Dragon Sculpture"
  },
  "uploaded_by_user": {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "user_name": "john_doe"
  }
}
```

---

### 7. Обновить метаданные файла

**PUT** `/api/model-files/:id`

Обновляет метаданные файла (нельзя изменить сам файл, путь хранения и хеш).

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `id` | UUID | ID файла |

**Body (JSON):**

```json
{
  "is_primary": true,
  "is_published": false
}
```

**Пример запроса:**

```bash
curl -X PUT http://localhost:3000/api/model-files/7c9e6679-7425-40de-944b-e07fc1f90ae7 \
  -H "Content-Type: application/json" \
  -d '{"is_primary": true}'
```

**Ответ (200 OK):** Обновленные данные файла.

---

### 8. Удалить файл

**DELETE** `/api/model-files/:id`

Удаляет файл из S3 и запись из БД.

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `id` | UUID | ID файла |

**Пример запроса:**

```bash
curl -X DELETE http://localhost:3000/api/model-files/7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Ответ (204 No Content):** Файл успешно удален.

---

## 🔒 Коды ответов

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 201 | Файл успешно создан |
| 204 | Успешно удалено |
| 400 | Неверный запрос |
| 404 | Файл не найден |
| 500 | Ошибка сервера |

---

## 📝 Примеры использования

### React компонент для загрузки

```typescript
import React, { useState } from 'react';

export const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_id', modelId);
    formData.append('file_type_id', '1');
    formData.append('uploaded_by', currentUserId);

    try {
      const response = await fetch('/api/model-files/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        alert('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".stl,.obj,.3mf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};
```

### Node.js скрипт для загрузки

```javascript
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function uploadModelFile(filePath, modelId, userId) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('model_id', modelId);
  form.append('file_type_id', '1');
  form.append('uploaded_by', userId);

  const response = await axios.post(
    'http://localhost:3000/api/model-files/upload',
    form,
    { headers: form.getHeaders() }
  );

  console.log('Upload result:', response.data);
  return response.data;
}

// Использование
uploadModelFile('./dragon.stl', 'model-uuid', 'user-uuid');
```

---

## 🎯 Best Practices

1. **Всегда проверяйте размер файла** перед загрузкой на клиенте
2. **Используйте временные ссылки** для публичных загрузок
3. **Кэшируйте временные ссылки** до истечения срока действия
4. **Показывайте прогресс загрузки** пользователю
5. **Обрабатывайте ошибки** корректно

---

## 🐛 Troubleshooting

### Ошибка "File too large"
- Проверьте размер файла (максимум 500 MB)
- Увеличьте лимит в `multer` если нужно

### Ошибка "Invalid file type"
- Убедитесь, что файл имеет правильное расширение
- Проверьте MIME type файла

### Ошибка "Failed to upload to S3"
- Проверьте, что MinIO запущен
- Проверьте credentials в `conf.json`
- Убедитесь, что бакет `slicehub-models` создан

---

**Готово!** API полностью настроено для работы с файлами моделей через S3 хранилище. 🎉

