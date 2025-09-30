import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface TokenTypeAttributes {
    id: number;
    name: string;
    description: string;
    default_expiry_interval: number;
    is_single_use: boolean;
    max_attempts: number;
}

interface TokenTypeCreationAttributes extends Optional<TokenTypeAttributes, "id"> {}

export class TokenType
    extends Model<TokenTypeAttributes, TokenTypeCreationAttributes>
    implements TokenTypeAttributes
{
    public id!: number;
    public name!: string;
    public description!: string;
    public default_expiry_interval!: number;
    public is_single_use!: boolean;
    public max_attempts!: number;

    static initialize(sequelize: Sequelize) {
        return TokenType.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING(32), allowNull: false, unique: true },
                description: { type: DataTypes.TEXT, allowNull: false },
                default_expiry_interval: { type: DataTypes.BIGINT, allowNull: false },
                is_single_use: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
                max_attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
            },
            {
                sequelize,
                tableName: "token_types",
                underscored: true,
                timestamps: true,
            }
        );
    }

    static associate(models: Models) {
        TokenType.hasMany(models.UserToken, { foreignKey: "token_type_id", as: "tokens" });
    }
}

export default TokenType;
