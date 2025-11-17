import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface PreviewModelAttributes {
    id: string;
    model_id: string;
    storage_type_id: number;
    storage_path: string;
    file_size: number;
    mime_type: string;
    width: number;
    height: number;
    sort_order: number;
    created_at: Date;
    uploaded_by: string;
}

interface PreviewModelCreationAttributes
    extends Optional<PreviewModelAttributes, "id" | "created_at"> {}

export class PreviewModel
    extends Model<PreviewModelAttributes, PreviewModelCreationAttributes>
    implements PreviewModelAttributes
{
    public id!: string;
    public model_id!: string;
    public storage_type_id!: number;
    public storage_path!: string;
    public file_size!: number;
    public mime_type!: string;
    public width!: number;
    public height!: number;
    public sort_order!: number;
    public created_at!: Date;
    public uploaded_by!: string;

    static initialize(sequelize: Sequelize) {
        return PreviewModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                model_id: { type: DataTypes.UUID, allowNull: false },
                storage_type_id: { type: DataTypes.INTEGER, allowNull: false },
                storage_path: { type: DataTypes.TEXT, allowNull: false },
                file_size: { type: DataTypes.BIGINT, allowNull: false },
                mime_type: { type: DataTypes.STRING(64), allowNull: false },
                width: { type: DataTypes.INTEGER, allowNull: false },
                height: { type: DataTypes.INTEGER, allowNull: false },
                sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                uploaded_by: { type: DataTypes.UUID, allowNull: false },
            },
            {
                sequelize,
                tableName: "previews_model",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: false,
            }
        );
    }

    static associate(models: Models) {
        PreviewModel.belongsTo(models.ThreeDModel, { foreignKey: "model_id", as: "model" });
        PreviewModel.belongsTo(models.StorageType, {
            foreignKey: "storage_type_id",
            as: "storage_type",
        });
        PreviewModel.belongsTo(models.User, { foreignKey: "uploaded_by", as: "uploaded_by_user" });
    }
}

export default PreviewModel;

