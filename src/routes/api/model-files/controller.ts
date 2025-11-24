import { Router, Request, Response } from "express";
import multer from "multer";
import crypto from "crypto";
import Models from "../../../../db/sequelize";
import { ApiErrorMessages as E } from "../errors";
import { validateBody } from "../validate";
import { modelFileService, s3StorageService } from "../../../services";
import { mainLogger as logger } from "../../../../sys/logger";
import { formatListResponse } from "../../../utils/response-formatter";

const router = Router();

// Расширяем тип Request для multer
interface MulterRequest extends Request {
	file?: Express.Multer.File;
}

// Настройка multer для загрузки в память
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 500 * 1024 * 1024, // 500 MB максимум
	},
	fileFilter: (
		_req: Request,
		file: Express.Multer.File,
		cb: multer.FileFilterCallback
	) => {
		// Разрешенные типы файлов для 3D моделей
		const allowedMimeTypes = [
			"application/octet-stream",
			"application/sla",
			"model/stl",
			"model/obj",
			"model/3mf",
			"application/vnd.ms-pki.stl",
		];

		const allowedExtensions = [".stl", ".obj", ".3mf", ".sla", ".gcode"];
		const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf("."));

		if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type. Only 3D model files are allowed."));
		}
	},
});


router.get("/", async (req: Request, res: Response) => {
	try {
		// Пагинация: по умолчанию первые 50 записей
		const limit = parseInt(req.query.limit as string) || 50;
		const offset = parseInt(req.query.offset as string) || 0;
		
		const data = await modelFileService.findAll({
			limit,
			offset,
			order: [['created_at', 'DESC']],
			include: ["file_type", "storage_type", "model"],
		});
		
		const total = await modelFileService.count();
		
		res.json(formatListResponse(data, { limit, offset, total }));
	} catch {
		res.status(500).json({ message: E.LIST_FAILED });
	}
});


router.get("/:id", async (req: Request, res: Response) => {
	try {
		const row = await modelFileService.findById(req.params.id, {
			include: ["file_type", "storage_type", "model", "uploaded_by_user"],
		});
		if (!row) return res.status(404).json({ message: E.NOT_FOUND });
		res.json(row);
	} catch {
		res.status(503).json({ message: E.DB_UNAVAILABLE });
	}
});


router.post("/upload", upload.single("file"), async (req: MulterRequest, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const { model_id, file_type_id, uploaded_by, is_primary = false } = req.body;

		// Валидация обязательных полей
		if (!model_id || !file_type_id || !uploaded_by) {
			return res.status(400).json({
				message: "Missing required fields: model_id, file_type_id, uploaded_by",
			});
		}

		// Проверка существования модели
		const model = await Models.ThreeDModel.findByPk(model_id);
		if (!model) {
			return res.status(404).json({ message: "Model not found" });
		}

		// Генерация хеша файла
		const checksum = crypto.createHash("sha256").update(req.file.buffer).digest("hex");

		// Генерация пути для S3
		const fileExtension = req.file.originalname.substring(req.file.originalname.lastIndexOf("."));
		const s3Key = `model-${model_id}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${fileExtension}`;

		// Загрузка файла в S3
		logger.info(`Uploading file to S3: ${s3Key}`);
		await s3StorageService.uploadFile("models", s3Key, req.file.buffer, req.file.mimetype);

		// Получение storage_type_id для S3
		const s3StorageType = await Models.StorageType.findOne({ where: { name: "s3" } });
		if (!s3StorageType) {
			throw new Error("S3 storage type not found in database");
		}

		// Сохранение метаданных в БД
		const fileRecord = await modelFileService.create({
			model_id,
			file_type_id: parseInt(file_type_id),
			original_filename: req.file.originalname,
			file_size: req.file.size,
			storage_type_id: s3StorageType.id,
			storage_path: s3Key,
			checksum_sha256: checksum,
			download_count: 0,
			is_primary: is_primary === "true" || is_primary === true,
			is_published: true,
			uploaded_by,
		});

		logger.info(`File uploaded successfully: ${fileRecord.id}`);

		res.status(201).json({
			success: true,
			file: fileRecord,
			message: "File uploaded successfully",
		});
	} catch (error: any) {
		logger.error(`File upload failed: ${error.message}`);
		res.status(500).json({
			message: "File upload failed",
			error: error.message,
		});
	}
});


router.get("/:id/download", async (req: Request, res: Response) => {
	try {
		const fileRecord = await modelFileService.findById(req.params.id, {
			include: ["storage_type"],
		});

		if (!fileRecord) {
			return res.status(404).json({ message: "File not found" });
		}

		// Проверяем тип хранилища
		const storageType = await Models.StorageType.findByPk(fileRecord.storage_type_id);
		if (!storageType || storageType.name !== "s3") {
			return res.status(400).json({ message: "File is not stored in S3" });
		}

		// Получаем файл из S3
		const fileBuffer = await s3StorageService.downloadFile("models", fileRecord.storage_path);

		// Увеличиваем счетчик скачиваний
		await modelFileService.update(fileRecord.id, {
			download_count: fileRecord.download_count + 1,
		});

		// Отправляем файл
		res.setHeader("Content-Type", "application/octet-stream");
		res.setHeader("Content-Disposition", `attachment; filename="${fileRecord.original_filename}"`);
		res.setHeader("Content-Length", fileBuffer.length);
		res.send(fileBuffer);
	} catch (error: any) {
		logger.error(`File download failed: ${error.message}`);
		res.status(500).json({ message: "File download failed" });
	}
});


router.get("/:id/download-link", async (req: Request, res: Response) => {
	try {
		const expiresIn = parseInt(req.query.expires as string) || 3600; // По умолчанию 1 час

		const fileRecord = await modelFileService.findById(req.params.id);
		if (!fileRecord) {
			return res.status(404).json({ message: "File not found" });
		}

		// Проверяем тип хранилища
		const storageType = await Models.StorageType.findByPk(fileRecord.storage_type_id);
		if (!storageType || storageType.name !== "s3") {
			return res.status(400).json({ message: "File is not stored in S3" });
		}

		// Генерируем временную ссылку
		const downloadUrl = await s3StorageService.getPresignedUrl(
			"models",
			fileRecord.storage_path,
			expiresIn
		);

		res.json({
			url: downloadUrl,
			expires_in: expiresIn,
			expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
			filename: fileRecord.original_filename,
		});
	} catch (error: any) {
		logger.error(`Generate download link failed: ${error.message}`);
		res.status(500).json({ message: "Failed to generate download link" });
	}
});

// GET /api/model-files/model/:modelId - Получить все файлы модели
router.get("/model/:modelId", async (req: Request, res: Response) => {
	try {
		const files = await modelFileService.findAll({
			where: { model_id: req.params.modelId },
			include: ["file_type", "storage_type"],
		});

		res.json(files);
	} catch (error) {
		logger.error(`Get model files failed: ${error}`);
		res.status(500).json({ message: "Failed to get model files" });
	}
});

// PUT /api/model-files/:id - Обновить метаданные файла
router.put(
	"/:id",
	validateBody(Models.FileModel as any, { partial: true }),
	async (req: Request, res: Response) => {
		try {
			// Запрещаем изменение критичных полей
			const { storage_path, checksum_sha256, file_size, ...updateData } = req.body;

			const updated = await modelFileService.update(req.params.id, updateData);
			if (!updated) return res.status(404).json({ message: E.NOT_FOUND });
			res.json(updated);
		} catch {
			res.status(400).json({ message: E.UPDATE_FAILED });
		}
	}
);

// DELETE /api/model-files/:id - Удалить файл
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const fileRecord = await modelFileService.findById(req.params.id);
		if (!fileRecord) {
			return res.status(404).json({ message: E.NOT_FOUND });
		}

		// Проверяем тип хранилища
		const storageType = await Models.StorageType.findByPk(fileRecord.storage_type_id);

		// Если файл в S3, удаляем его оттуда
		if (storageType && storageType.name === "s3") {
			try {
				await s3StorageService.deleteFile("models", fileRecord.storage_path);
				logger.info(`File deleted from S3: ${fileRecord.storage_path}`);
			} catch (error: any) {
				logger.error(`Failed to delete file from S3: ${error.message}`);
				// Продолжаем удаление записи из БД даже если не удалось удалить из S3
			}
		}

		// Удаляем запись из БД
		const deleted = await modelFileService.delete(req.params.id);
		if (!deleted) return res.status(404).json({ message: E.NOT_FOUND });

		res.status(204).send();
	} catch (error: any) {
		logger.error(`File deletion failed: ${error.message}`);
		res.status(400).json({ message: E.DELETE_FAILED });
	}
});

export default router;
