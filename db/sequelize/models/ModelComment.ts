import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface ModelCommentAttributes {
    id: number;
    model_id: string;
    user_id: string;
    parent_comment_id?: number;
    content: string;
    is_edited: boolean;
    edited_at?: Date;
    is_deleted: boolean;
    deleted_at?: Date;
    like_count: number;
    created_at: Date;
    updated_at: Date;
}

interface ModelCommentCreationAttributes
    extends Optional<ModelCommentAttributes, "id" | "created_at"> {}

export class ModelComment
    extends Model<ModelCommentAttributes, ModelCommentCreationAttributes>
    implements ModelCommentAttributes
{
    public id!: number;
    public model_id!: string;
    public user_id!: string;
    public parent_comment_id?: number;
    public content!: string;
    public is_edited!: boolean;
    public edited_at?: Date;
    public is_deleted!: boolean;
    public deleted_at?: Date;
    public like_count!: number;
    public created_at!: Date;
    public updated_at!: Date;

    static initialize(sequelize: Sequelize) {
        return ModelComment.init(
            {
                id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
                model_id: { type: DataTypes.UUID, allowNull: false },
                user_id: { type: DataTypes.UUID, allowNull: false },
                parent_comment_id: { type: DataTypes.BIGINT, allowNull: true },
                content: { type: DataTypes.TEXT, allowNull: false },
                is_edited: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                edited_at: { type: DataTypes.DATE, allowNull: true },
                is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                deleted_at: { type: DataTypes.DATE, allowNull: true },
                like_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
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
            },
            {
                sequelize,
                tableName: "model_comments",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: false,
                indexes: [
                    { fields: ["model_id"] },
                    { fields: ["user_id"] },
                    { fields: ["parent_comment_id"] },
                    { fields: ["created_at"] },
                ],
            }
        );
    }

    static associate(models: Models) {
        ModelComment.belongsTo(models.Model3d, { foreignKey: "model_id", as: "model" });
        ModelComment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        ModelComment.belongsTo(models.ModelComment, {
            foreignKey: "parent_comment_id",
            as: "parent",
        });
        ModelComment.hasMany(models.ModelComment, {
            foreignKey: "parent_comment_id",
            as: "replies",
        });
    }
}

export default ModelComment;
