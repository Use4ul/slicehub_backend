import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface CommentAttachmentAttributes {
    id: string;
    comment_id: number;
    storage_type_id: number;
    filename: string;
    original_filename: string;
    file_size: number;
    mime_type: string;
    storage_path: string;
    description?: string;
    created_at: Date;
}

interface CommentAttachmentCreationAttributes
    extends Optional<CommentAttachmentAttributes, "id" | "created_at"> {}

export class CommentAttachment
    extends Model<CommentAttachmentAttributes, CommentAttachmentCreationAttributes>
    implements CommentAttachmentAttributes
{
    public id!: string;
    public comment_id!: number;
    public storage_type_id!: number;
    public filename!: string;
    public original_filename!: string;
    public file_size!: number;
    public mime_type!: string;
    public storage_path!: string;
    public description?: string;
    public created_at!: Date;

    static initialize(sequelize: Sequelize) {
        return CommentAttachment.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                comment_id: { type: DataTypes.BIGINT, allowNull: false },
                storage_type_id: { type: DataTypes.INTEGER, allowNull: false },
                filename: { type: DataTypes.STRING(255), allowNull: false },
                original_filename: { type: DataTypes.STRING(255), allowNull: false },
                file_size: { type: DataTypes.BIGINT, allowNull: false },
                mime_type: { type: DataTypes.STRING(100), allowNull: false },
                storage_path: { type: DataTypes.TEXT, allowNull: false },
                description: { type: DataTypes.TEXT, allowNull: true },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            {
                sequelize,
                tableName: "comment_attachments",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: false,
                indexes: [{ fields: ["comment_id"] }, { fields: ["storage_type_id"] }],
            }
        );
    }

    static associate(models: Models) {
        CommentAttachment.belongsTo(models.CommentModel, {
            foreignKey: "comment_id",
            as: "comment",
            targetKey: "id",
        });
        CommentAttachment.belongsTo(models.StorageType, {
            foreignKey: "storage_type_id",
            as: "storage_type",
            targetKey: "id",
        });
    }
}

export default CommentAttachment;
