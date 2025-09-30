import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface CollectionItemAttributes {
    collection_id: string;
    model_id: string;
    sort_order: number;
}

interface CollectionItemCreationAttributes
    extends Optional<CollectionItemAttributes, "sort_order"> {}

export class CollectionItem
    extends Model<CollectionItemAttributes, CollectionItemCreationAttributes>
    implements CollectionItemAttributes
{
    public collection_id!: string;
    public model_id!: string;
    public sort_order!: number;

    static initialize(sequelize: Sequelize) {
        return CollectionItem.init(
            {
                collection_id: { type: DataTypes.UUID, primaryKey: true },
                model_id: { type: DataTypes.UUID, primaryKey: true },
                sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            },
            {
                sequelize,
                tableName: "collection_items",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models: Models) {
        CollectionItem.belongsTo(models.Collection, {
            foreignKey: "collection_id",
            as: "collection",
        });
        CollectionItem.belongsTo(models.Model3d, { foreignKey: "model_id", as: "model" });
    }
}

export default CollectionItem;
