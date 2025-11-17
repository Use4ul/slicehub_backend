import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface CategoryModelAttributes {
    id: number;
    name: string;
    description: string;
    parent_id: number | null;
    slug: string | null;
    is_active: boolean;
    sort_order: number;
}

interface CategoryModelCreationAttributes
    extends Optional<CategoryModelAttributes, "id" | "is_active" | "sort_order"> {}

export class CategoryModel
    extends Model<CategoryModelAttributes, CategoryModelCreationAttributes>
    implements CategoryModelAttributes
{
    public id!: number;
    public name!: string;
    public description!: string;
    declare parent_id: number | null;
    declare slug: string | null;
    public is_active!: boolean;
    declare sort_order: number;

    static initialize(sequelize: Sequelize) {
        return CategoryModel.init(
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
                tableName: "categories_model",
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
        CategoryModel.belongsTo(models.CategoryModel, { foreignKey: "parent_id", as: "parent" });
        CategoryModel.hasMany(models.CategoryModel, { foreignKey: "parent_id", as: "children" });
        CategoryModel.hasMany(models.ThreeDModel, { foreignKey: "category_id", as: "models" });
    }
}

export default CategoryModel;

