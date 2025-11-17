import { DataTypes, Model, Sequelize } from "sequelize";
import { Models } from "./index";

interface TagModelAttributes {
    model_id: string;
    tag_id: number;
}

export class TagModel extends Model<TagModelAttributes> implements TagModelAttributes {
    public model_id!: string;
    public tag_id!: number;

    static initialize(sequelize: Sequelize) {
        return TagModel.init(
            {
                model_id: { type: DataTypes.UUID, primaryKey: true },
                tag_id: { type: DataTypes.BIGINT, primaryKey: true },
            },
            {
                sequelize,
                tableName: "tags_model",
                underscored: true,
                timestamps: false,
                indexes: [{ fields: ["tag_id"] }],
            }
        );
    }

    static associate(models: Models) {
        TagModel.belongsTo(models.ThreeDModel, { foreignKey: "model_id", as: "model" });
        TagModel.belongsTo(models.Tag, { foreignKey: "tag_id", as: "tag" });
    }
}

export default TagModel;

