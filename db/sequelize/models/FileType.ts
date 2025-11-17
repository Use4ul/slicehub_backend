import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface FileTypeAttributes {
    id: number;
    description: string;
    extension: string;
}

interface FileTypeCreationAttributes extends Optional<FileTypeAttributes, "id"> {}

export class FileType
    extends Model<FileTypeAttributes, FileTypeCreationAttributes>
    implements FileTypeAttributes
{
    public id!: number;
    public description!: string;
    public extension!: string;

    static initialize(sequelize: Sequelize) {
        return FileType.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                description: { type: DataTypes.TEXT, allowNull: false },
                extension: { type: DataTypes.STRING(16), allowNull: false, unique: true },
            },
            {
                sequelize,
                tableName: "file_types",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models: Models) {
        FileType.hasMany(models.FileModel, { foreignKey: "file_type_id", as: "model_files" });
    }
}

export default FileType;
