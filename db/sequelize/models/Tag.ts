import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface TagAttributes {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
}

interface TagCreationAttributes extends Optional<TagAttributes, "id" | "is_active"> {}

export class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
    public id!: number;
    public name!: string;
    public slug!: string;
    public is_active!: boolean;

    static initialize(sequelize: Sequelize) {
        return Tag.init(
            {
                id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
                name: { type: DataTypes.STRING(64), allowNull: false, unique: true },
                slug: { type: DataTypes.STRING(64), allowNull: false, unique: true },
                is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            },
            {
                sequelize,
                tableName: "tags",
                underscored: false,
                timestamps: false,
            }
        );
    }

    static associate(models: Models) {
        Tag.belongsToMany(models.Model3d, {
            through: models.ModelTag,
            foreignKey: "tag_id",
            as: "models",
        });
    }
}

export default Tag;
