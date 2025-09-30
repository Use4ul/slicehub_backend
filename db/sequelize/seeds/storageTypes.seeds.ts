import { StorageType } from "../models";

export const storageTypesSeed = {
    name: "StorageTypes",
    async run() {
        await StorageType.bulkCreate(
            [
                {
                    name: "local",
                    description: "Локальное хранилище на сервере",
                    requires_url_processing: false,
                },
                {
                    name: "s3",
                    description: "Облачное хранилище (AWS S3, Yandex Cloud)",
                    requires_url_processing: true,
                },
                {
                    name: "url",
                    description: "Внешняя ссылка (соцсети, CDN)",
                    requires_url_processing: true,
                },
                { name: "ftp", description: "FTP сервер", requires_url_processing: true },
                {
                    name: "ipfs",
                    description: "IPFS (децентрализованное хранилище)",
                    requires_url_processing: true,
                },
            ],
            { ignoreDuplicates: true }
        );
    },
};
