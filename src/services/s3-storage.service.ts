import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import conf from "../../conf.json";
import { Configuration } from "../../config/config";
import { mainLogger as logger } from "../../sys/logger";

const config = conf as unknown as Configuration;

export type BucketType = "models" | "previews" | "avatars" | "attachments";

/**
 * Сервис для работы с S3-совместимым хранилищем (MinIO)
 */
export class S3StorageService {
    private s3Client: S3Client;
    private buckets: Record<BucketType, string>;

    constructor() {
        if (!config.s3) {
            throw new Error("S3 configuration is missing in conf.json");
        }

        // Приоритет переменным окружения для Docker
        const endpoint = process.env.S3_ENDPOINT || config.s3.endpoint;
        const accessKeyId = process.env.S3_ACCESS_KEY_ID || config.s3.accessKeyId;
        const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || config.s3.secretAccessKey;
        const region = process.env.S3_REGION || config.s3.region;
        const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true" || config.s3.forcePathStyle;

        this.s3Client = new S3Client({
            endpoint,
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle,
        });

        this.buckets = config.s3.buckets;

        logger.info(`S3 Storage Service initialized with endpoint: ${endpoint}`);
    }

    /**
     * Получить имя бакета по типу
     */
    private getBucketName(bucketType: BucketType): string {
        return this.buckets[bucketType];
    }

    /**
     * Загрузить файл в S3
     */
    async uploadFile(
        bucketType: BucketType,
        key: string,
        body: Buffer | Uint8Array | Blob | string,
        contentType?: string
    ): Promise<string> {
        const bucket = this.getBucketName(bucketType);

        try {
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            });

            await this.s3Client.send(command);
            logger.info(`File uploaded successfully: ${bucket}/${key}`);

            return `${bucket}/${key}`;
        } catch (error) {
            logger.error(`Failed to upload file to S3: ${error}`);
            throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    /**
     * Скачать файл из S3
     */
    async downloadFile(bucketType: BucketType, key: string): Promise<Buffer> {
        const bucket = this.getBucketName(bucketType);

        try {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            const response = await this.s3Client.send(command);

            if (!response.Body) {
                throw new Error("Empty response body");
            }

            const chunks: Uint8Array[] = [];
            for await (const chunk of response.Body as any) {
                chunks.push(chunk);
            }

            return Buffer.concat(chunks);
        } catch (error) {
            logger.error(`Failed to download file from S3: ${error}`);
            throw new Error(`Failed to download file: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    /**
     * Удалить файл из S3
     */
    async deleteFile(bucketType: BucketType, key: string): Promise<void> {
        const bucket = this.getBucketName(bucketType);

        try {
            const command = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            await this.s3Client.send(command);
            logger.info(`File deleted successfully: ${bucket}/${key}`);
        } catch (error) {
            logger.error(`Failed to delete file from S3: ${error}`);
            throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    /**
     * Проверить существование файла
     */
    async fileExists(bucketType: BucketType, key: string): Promise<boolean> {
        const bucket = this.getBucketName(bucketType);

        try {
            const command = new HeadObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            await this.s3Client.send(command);
            return true;
        } catch (error: any) {
            if (error.$metadata?.httpStatusCode === 404) {
                return false;
            }
            logger.error(`Failed to check file existence in S3: ${error}`);
            throw error;
        }
    }

    /**
     * Получить предподписанный URL для скачивания (временная ссылка)
     */
    async getPresignedUrl(bucketType: BucketType, key: string, expiresIn: number = 3600): Promise<string> {
        const bucket = this.getBucketName(bucketType);

        try {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            const url = await getSignedUrl(this.s3Client, command, { expiresIn });
            return url;
        } catch (error) {
            logger.error(`Failed to generate presigned URL: ${error}`);
            throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    /**
     * Получить список файлов в папке
     */
    async listFiles(bucketType: BucketType, prefix?: string): Promise<string[]> {
        const bucket = this.getBucketName(bucketType);

        try {
            const command = new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: prefix,
            });

            const response = await this.s3Client.send(command);

            return response.Contents?.map((item) => item.Key || "") || [];
        } catch (error) {
            logger.error(`Failed to list files in S3: ${error}`);
            throw new Error(`Failed to list files: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    /**
     * Получить публичный URL файла (для публичных бакетов)
     */
    getPublicUrl(bucketType: BucketType, key: string): string {
        const bucket = this.getBucketName(bucketType);
        const endpoint = process.env.S3_ENDPOINT || config.s3?.endpoint || "";
        return `${endpoint}/${bucket}/${key}`;
    }
}

// Экспортируем singleton экземпляр
export const s3StorageService = new S3StorageService();

