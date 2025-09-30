import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface ModelCategoryAttributes {
    id: number;
    name: string;
    description: string;
    parent_id: number | null;
    slug: string | null;
    is_active: boolean;
    sort_order: number;
}

interface ModelCategoryCreationAttributes
    extends Optional<ModelCategoryAttributes, "id" | "is_active" | "sort_order"> {}

export class ModelCategory
    extends Model<ModelCategoryAttributes, ModelCategoryCreationAttributes>
    implements ModelCategoryAttributes
{
    public id!: number;
    public name!: string;
    public description!: string;
    declare parent_id: number | null;
    declare slug: string | null;
    public is_active!: boolean;
    declare sort_order: number;

    static initialize(sequelize: Sequelize) {
        return ModelCategory.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
                description: { type: DataTypes.TEXT, allowNull: false },
                parent_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
                slug: { type: DataTypes.STRING(255), allowNull: true },
                is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
                sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            },
            {
                sequelize,
                tableName: "model_categories",
                underscored: true,
                timestamps: false,
                indexes: [
                    { fields: ["parent_id"] },
                    { fields: ["slug"] },
                    { fields: ["is_active"] },
                    { fields: ["sort_order"] },
                ],
            }
        );
    }

    static associate(models: Models) {
        ModelCategory.belongsTo(models.ModelCategory, { foreignKey: "parent_id", as: "parent" });
        ModelCategory.hasMany(models.ModelCategory, { foreignKey: "parent_id", as: "children" });
        ModelCategory.hasMany(models.Model3d, { foreignKey: "category_id", as: "models" });
    }
}

export default ModelCategory;
