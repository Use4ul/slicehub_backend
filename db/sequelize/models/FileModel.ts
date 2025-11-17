import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface FileModelAttributes {
    id: string;
    model_id: string;
    file_type_id: number;
    original_filename: string;
    file_size: number;
    storage_type_id: number; // Убрали значение по умолчанию здесь
    storage_path: string;
    checksum_sha256: string;
    download_count: number;
    is_primary: boolean;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
    uploaded_by: string;
}

interface FileModelCreationAttributes extends Optional<FileModelAttributes, "id" | "created_at"> {}

export class FileModel
    extends Model<FileModelAttributes, FileModelCreationAttributes>
    implements FileModelAttributes
{
    public id!: string;
    public model_id!: string;
    public file_type_id!: number;
    public original_filename!: string;
    public file_size!: number;
    public storage_type_id!: number;
    public storage_path!: string;
    public checksum_sha256!: string;
    public download_count!: number;
    public is_primary!: boolean;
    public is_published!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
    public uploaded_by!: string;

    static initialize(sequelize: Sequelize) {
        return FileModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                model_id: { type: DataTypes.UUID, allowNull: false },
                file_type_id: { type: DataTypes.INTEGER, allowNull: false },
                original_filename: { type: DataTypes.STRING(255), allowNull: false },
                file_size: { type: DataTypes.BIGINT, allowNull: false },
                storage_type_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                storage_path: { type: DataTypes.TEXT, allowNull: false },
                checksum_sha256: { type: DataTypes.CHAR(64), allowNull: false },
                download_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                is_published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                uploaded_by: { type: DataTypes.UUID, allowNull: false },
            },
            {
                sequelize,
                tableName: "files_model",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: false,
                indexes: [
                    { fields: ["model_id"] },
                    { fields: ["file_type_id"] },
                    { fields: ["storage_type_id"] },
                    { fields: ["is_primary"] },
                    { fields: ["is_published"] },
                ],
            }
        );
    }

    static associate(models: Models) {
        FileModel.belongsTo(models.ThreeDModel, { foreignKey: "model_id", as: "model" });
        FileModel.belongsTo(models.FileType, { foreignKey: "file_type_id", as: "file_type" });
        FileModel.belongsTo(models.StorageType, {
            foreignKey: "storage_type_id",
            as: "storage_type",
        });
        FileModel.belongsTo(models.User, { foreignKey: "uploaded_by", as: "uploaded_by_user" });
    }
}

export default FileModel;

