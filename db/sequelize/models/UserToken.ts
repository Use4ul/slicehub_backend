import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface UserTokenAttributes {
    id: string;
    user_id: string;
    token_type_id: number;
    token_value: string;
    expires_at?: Date;
    used: boolean;
    created_at: Date;
    metadata: object;
}

interface UserTokenCreationAttributes extends Optional<UserTokenAttributes, "id" | "created_at"> {}

export class UserToken
    extends Model<UserTokenAttributes, UserTokenCreationAttributes>
    implements UserTokenAttributes
{
    public id!: string;
    public user_id!: string;
    public token_type_id!: number;
    public token_value!: string;
    public expires_at?: Date;
    public used!: boolean;
    public created_at!: Date;
    public metadata!: object;

    static initialize(sequelize: Sequelize) {
        return UserToken.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                user_id: { type: DataTypes.UUID, allowNull: false },
                token_type_id: { type: DataTypes.INTEGER, allowNull: false },
                token_value: { type: DataTypes.STRING(128), allowNull: false },
                expires_at: { type: DataTypes.DATE, allowNull: true },
                used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
            },
            {
                sequelize,
                tableName: "user_tokens",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: false,
                indexes: [
                    { fields: ["user_id"] },
                    { fields: ["token_value"] },
                    { fields: ["token_type_id"] },
                    { fields: ["expires_at"] },
                ],
            }
        );
    }

    static associate(models: Models) {
        UserToken.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        UserToken.belongsTo(models.TokenType, { foreignKey: "token_type_id", as: "token_type" });
    }
}

export default UserToken;
