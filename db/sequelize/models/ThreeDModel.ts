import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface ThreeDModelAttributes {
    id: string;
    title: string;
    description: string;
    slug?: string;
    category_id: number;
    user_id: string;
    is_public: boolean;
    print_time_estimate?: number;
    download_count: number;
    view_count: number;
    like_count: number;
    is_featured: boolean;
    is_draft: boolean;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
}

interface ThreeDModelCreationAttributes
    extends Optional<ThreeDModelAttributes, "id" | "created_at" | "updated_at"> {}

export class ThreeDModel
    extends Model<ThreeDModelAttributes, ThreeDModelCreationAttributes>
    implements ThreeDModelAttributes
{
    public id!: string;
    public title!: string;
    public description!: string;
    public slug?: string;
    public category_id!: number;
    public user_id!: string;
    public is_public!: boolean;
    public print_time_estimate?: number;
    public download_count!: number;
    public view_count!: number;
    public like_count!: number;
    public is_featured!: boolean;
    public is_draft!: boolean;
    public published_at?: Date;
    public created_at!: Date;
    public updated_at!: Date;

    static initialize(sequelize: Sequelize) {
        return ThreeDModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                title: { type: DataTypes.STRING(255), allowNull: false },
                description: { type: DataTypes.TEXT, allowNull: false },
                slug: { type: DataTypes.STRING(255), allowNull: true, unique: true },
                category_id: { type: DataTypes.INTEGER, allowNull: false },
                user_id: { type: DataTypes.UUID, allowNull: false },
                is_public: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
                print_time_estimate: { type: DataTypes.INTEGER, allowNull: true },
                download_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                view_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                like_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                is_featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                is_draft: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
                published_at: { type: DataTypes.DATE, allowNull: true },
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
                tableName: "three_d_models",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
                indexes: [
                    { fields: ["user_id"] },
                    { fields: ["category_id"] },
                    { fields: ["is_public"] },
                    { fields: ["published_at"] },
                    { fields: ["created_at"] },
                ],
            }
        );
    }

    static associate(models: Models) {
        ThreeDModel.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        ThreeDModel.belongsTo(models.CategoryModel, { foreignKey: "category_id", as: "category" });
        ThreeDModel.hasMany(models.FileModel, { foreignKey: "model_id", as: "files" });
        ThreeDModel.hasMany(models.PreviewModel, { foreignKey: "model_id", as: "previews" });
        ThreeDModel.belongsToMany(models.License, {
            through: models.LicenseModel,
            foreignKey: "model_id",
            as: "licenses",
        });
        ThreeDModel.belongsToMany(models.Tag, {
            through: models.TagModel,
            foreignKey: "model_id",
            as: "tags",
        });
        ThreeDModel.hasMany(models.RatingModel, { foreignKey: "model_id", as: "ratings" });
        ThreeDModel.hasMany(models.CommentModel, { foreignKey: "model_id", as: "comments" });
        ThreeDModel.belongsToMany(models.Collection, {
            through: models.CollectionItem,
            foreignKey: "model_id",
            as: "collections",
        });
    }
}

export default ThreeDModel;

