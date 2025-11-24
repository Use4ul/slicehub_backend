# 🚀 Быстрый старт - Загрузка файлов моделей

## ⚡ За 2 минуты

### 1. Убедитесь, что всё запущено

```bash
docker-compose ps
```

Все сервисы должны быть **healthy**.

### 2. Установите зависимости (если еще не установлены)

```bash
npm install
```

### 3. Тестовая загрузка файла

#### Через cURL:

```bash
curl -X POST http://localhost:3000/api/model-files/upload \
  -F "file=@/path/to/your/model.stl" \
  -F "model_id=550e8400-e29b-41d4-a716-446655440000" \
  -F "file_type_id=1" \
  -F "uploaded_by=650e8400-e29b-41d4-a716-446655440000" \
  -F "is_primary=true"
```

#### Через Postman:

1. **Создайте новый request:**
   - Method: `POST`
   - URL: `http://localhost:3000/api/model-files/upload`

2. **В Body выберите:**
   - Type: `form-data`

3. **Добавьте поля:**
   | Key | Type | Value |
   |-----|------|-------|
   | file | File | Выберите .stl файл |
   | model_id | Text | UUID вашей модели |
   | file_type_id | Text | 1 |
   | uploaded_by | Text | UUID пользователя |
   | is_primary | Text | true |

4. **Нажмите Send**

### 4. Проверьте загрузку

Файл должен появиться в MinIO Console:
- Откройте: http://localhost:9001
- Логин: `minioadmin`
- Пароль: `minioadmin`
- Зайдите в бакет: `slicehub-models`
- Увидите загруженный файл! 🎉

### 5. Скачайте файл обратно

Используйте `file_id` из ответа предыдущего запроса:

```bash
curl -X GET "http://localhost:3000/api/model-files/{file_id}/download" \
  -o downloaded_model.stl
```

### 6. Получите временную ссылку

```bash
curl -X GET "http://localhost:3000/api/model-files/{file_id}/download-link"
```

Ответ:
```json
{
  "url": "http://localhost:9000/slicehub-models/model-xxx/file.stl?...",
  "expires_in": 3600,
  "expires_at": "2025-11-18T13:00:00.000Z"
}
```

Откройте эту ссылку в браузере - файл скачается!

---

## 🎯 Основные эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/model-files/upload` | Загрузить файл |
| GET | `/api/model-files/:id/download` | Скачать файл |
| GET | `/api/model-files/:id/download-link` | Получить временную ссылку |
| GET | `/api/model-files/model/:modelId` | Все файлы модели |
| DELETE | `/api/model-files/:id` | Удалить файл |

---

## 🧪 Тестовые данные

Если у вас нет тестовой модели, создайте её через API или используйте существующую из базы:

```sql
-- Найти модели в БД
SELECT id, title FROM slicehub.models_3d LIMIT 5;

-- Найти пользователей
SELECT id, user_name FROM slicehub.users LIMIT 5;
```

Или через API:

```bash
# Получить модели
curl http://localhost:3000/api/models-3d

# Получить пользователей
curl http://localhost:3000/api/users
```

---

## 🎨 HTML форма для тестирования

Создайте файл `test-upload.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Model File Upload</title>
</head>
<body>
    <h1>Upload 3D Model File</h1>
    <form id="uploadForm">
        <div>
            <label>File:</label>
            <input type="file" name="file" accept=".stl,.obj,.3mf" required>
        </div>
        <div>
            <label>Model ID:</label>
            <input type="text" name="model_id" value="550e8400-e29b-41d4-a716-446655440000" required>
        </div>
        <div>
            <label>File Type ID:</label>
            <input type="number" name="file_type_id" value="1" required>
        </div>
        <div>
            <label>Uploaded By:</label>
            <input type="text" name="uploaded_by" value="650e8400-e29b-41d4-a716-446655440000" required>
        </div>
        <div>
            <label>
                <input type="checkbox" name="is_primary" value="true">
                Is Primary File
            </label>
        </div>
        <button type="submit">Upload</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const resultDiv = document.getElementById('result');
            
            resultDiv.innerHTML = 'Uploading...';
            
            try {
                const response = await fetch('http://localhost:3000/api/model-files/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    resultDiv.innerHTML = `
                        <h3>✅ Success!</h3>
                        <p>File ID: ${result.file.id}</p>
                        <p>Filename: ${result.file.original_filename}</p>
                        <p>Size: ${(result.file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                        <a href="http://localhost:3000/api/model-files/${result.file.id}/download">Download</a>
                    `;
                } else {
                    resultDiv.innerHTML = `<p style="color: red;">❌ Error: ${result.message}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p style="color: red;">❌ Error: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
```

Откройте файл в браузере и тестируйте загрузку!

---

## 📚 Полная документация

Смотрите [MODEL_FILES_API.md](MODEL_FILES_API.md) для детальной информации обо всех endpoint'ах.

---

**Готово!** Теперь вы можете загружать файлы моделей через S3! 🎉

