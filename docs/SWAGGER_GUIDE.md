# 📚 Swagger API Documentation Guide

## 🚀 Доступ к документации

После запуска приложения, Swagger UI доступен по адресу:

```
http://localhost:3001/api-docs
```

---

## 📋 Документированные API разделы

### ✅ **Готово:**

#### **1. 3D Models API** (`/api/models-3d`)
- `GET /api/models-3d` - Получить список всех моделей
- `GET /api/models-3d/:id` - Получить модель по ID
- `POST /api/models-3d` - Создать новую модель
- `PUT /api/models-3d/:id` - Обновить модель
- `DELETE /api/models-3d/:id` - Удалить модель

#### **2. Model Files API** (`/api/model-files`)
- `GET /api/model-files` - Получить список всех файлов
- `GET /api/model-files/:id` - Получить файл по ID
- `POST /api/model-files/upload` - Загрузить файл (multipart/form-data)
- `GET /api/model-files/:id/download` - Скачать файл
- `GET /api/model-files/:id/download-link` - Получить временную ссылку для скачивания

#### **3. Users API** (`/api/users`)
- `GET /api/users/schema` - Получить JSON Schema модели
- `GET /api/users` - Получить список пользователей
- `GET /api/users/:id` - Получить пользователя по ID

---

## 🎯 Как использовать Swagger UI

### **1. Просмотр документации**
Откройте браузер и перейдите по адресу: `http://localhost:3001/api-docs`

### **2. Тестирование API**

#### **Шаг 1:** Выберите endpoint
Кликните на интересующий вас endpoint (например, `GET /api/models-3d`)

#### **Шаг 2:** Нажмите "Try it out"
Кнопка в правом верхнем углу раздела endpoint

#### **Шаг 3:** Заполните параметры
Для endpoints с параметрами (path, query, body) заполните необходимые поля

#### **Шаг 4:** Нажмите "Execute"
Swagger отправит реальный запрос к API

#### **Шаг 5:** Просмотрите ответ
В разделе "Responses" увидите:
- HTTP статус код
- Response body (JSON)
- Response headers
- Curl команда для повторения запроса

---

## 📝 Примеры использования

### **Пример 1: Получить список моделей**

```bash
# Через Swagger UI
GET /api/models-3d

# Через curl
curl -X GET "http://localhost:3001/api/models-3d" -H "accept: application/json"
```

### **Пример 2: Загрузить файл модели**

```bash
# Через Swagger UI
POST /api/model-files/upload
- Выберите файл
- Укажите model_id
- Укажите file_type_id
- Укажите uploaded_by

# Через curl
curl -X POST "http://localhost:3001/api/model-files/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/model.stl" \
  -F "model_id=uuid-here" \
  -F "file_type_id=1" \
  -F "uploaded_by=user-uuid-here"
```

### **Пример 3: Скачать файл**

```bash
# Через Swagger UI
GET /api/model-files/{id}/download

# Через curl
curl -X GET "http://localhost:3001/api/model-files/{file-id}/download" \
  --output downloaded_model.stl
```

---

## 🎨 Темная тема

Swagger UI настроен с **темной темой** для комфортного просмотра.

---

## 🔧 Для разработчиков: Как добавить новый endpoint в документацию

### **1. Добавить JSDoc комментарий**

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Краткое описание
 *     tags: [Tag Name]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Описание параметра
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourModel'
 */
router.get("/:id", async (req, res) => {
  // ...
});
```

### **2. Добавить схему модели (если нужно)**

Отредактируйте `src/swagger/schemas.ts`:

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     YourModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 */
```

### **3. Перезапустить приложение**

```bash
npm run dev
# или
docker-compose restart app
```

Документация обновится автоматически!

---

## 📚 Полезные ссылки

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)

---

## ✅ Что уже документировано

| Раздел | Endpoints | Статус |
|--------|-----------|--------|
| **3D Models** | 5/5 | ✅ Готово |
| **Model Files** | 5/5 | ✅ Готово |
| **Users** | 3/5 | 🟡 Частично |
| Comments | 0/? | ⏳ Ожидает |
| Collections | 0/? | ⏳ Ожидает |
| Categories | 0/? | ⏳ Ожидает |
| Tags | 0/? | ⏳ Ожидает |
| Ratings | 0/? | ⏳ Ожидает |

---

## 🎯 Следующие шаги

1. ✅ Базовая документация для ключевых endpoints
2. 🔄 Добавить остальные endpoints для Users
3. ⏳ Документировать Comments API
4. ⏳ Документировать Collections API
5. ⏳ Документировать Categories, Tags, Ratings

---

**Готово!** 🚀 Теперь у вас есть интерактивная API документация!

