import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface CollectionAttributes {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    sort_order: number;
    cover_image_path?: string;
}

interface CollectionCreationAttributes extends Optional<CollectionAttributes, "id"> {}

export class Collection
    extends Model<CollectionAttributes, CollectionCreationAttributes>
    implements CollectionAttributes
{
    public id!: string;
    public user_id!: string;
    public title!: string;
    public description?: string;
    public sort_order!: number;
    public cover_image_path?: string;

    static initialize(sequelize: Sequelize) {
        return Collection.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                user_id: { type: DataTypes.UUID, allowNull: false },
                title: { type: DataTypes.STRING(255), allowNull: false },
                description: { type: DataTypes.TEXT, allowNull: true },
                sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                cover_image_path: { type: DataTypes.TEXT, allowNull: true },
            },
            {
                sequelize,
                tableName: "collections",
                underscored: true,
                indexes: [{ fields: ["user_id"] }],
            }
        );
    }

    static associate(models: Models) {
        Collection.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        Collection.belongsToMany(models.Model3d, {
            through: models.CollectionItem,
            foreignKey: "collection_id",
            as: "models",
        });
    }
}

export default Collection;
