import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface RoleAttributes {
    id: number;
    name: string;
    description: string;
    created_at: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "id" | "created_at"> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public created_at!: Date;

    static initialize(sequelize: Sequelize) {
        return Role.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING(32), allowNull: false, unique: true },
                description: { type: DataTypes.TEXT, allowNull: false },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            {
                sequelize,
                tableName: "roles",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: false,
            }
        );
    }

    static associate(models: Models) {
        Role.belongsToMany(models.User, {
            through: models.UserRole,
            foreignKey: "role_id",
            as: "users",
        });
    }
}

export default Role;
