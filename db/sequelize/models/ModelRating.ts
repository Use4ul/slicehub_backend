import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface ModelRatingAttributes {
    user_id: string;
    model_id: string;
    rating: number;
    created_at: Date;
    updated_at: Date;
}

interface ModelRatingCreationAttributes
    extends Optional<ModelRatingAttributes, "created_at" | "updated_at"> {}

export class ModelRating
    extends Model<ModelRatingAttributes, ModelRatingCreationAttributes>
    implements ModelRatingAttributes
{
    public user_id!: string;
    public model_id!: string;
    public rating!: number;
    public created_at!: Date;
    public updated_at!: Date;

    static initialize(sequelize: Sequelize) {
        return ModelRating.init(
            {
                user_id: { type: DataTypes.UUID, primaryKey: true },
                model_id: { type: DataTypes.UUID, primaryKey: true },
                rating: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    validate: { min: 1, max: 10 },
                },
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
                tableName: "model_ratings",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
                indexes: [{ fields: ["model_id"] }, { fields: ["rating"] }],
            }
        );
    }

    static associate(models: Models) {
        ModelRating.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        ModelRating.belongsTo(models.Model3d, { foreignKey: "model_id", as: "model" });
    }
}

export default ModelRating;
