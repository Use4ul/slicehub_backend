import { DataTypes, Model, Sequelize } from "sequelize";
import { Models } from "./index";

interface UserRoleAttributes {
    user_id: string;
    role_id: number;
}

export class UserRole extends Model<UserRoleAttributes> implements UserRoleAttributes {
    public user_id!: string;
    public role_id!: number;

    static initialize(sequelize: Sequelize) {
        return UserRole.init(
            {
                user_id: { type: DataTypes.UUID, primaryKey: true },
                role_id: { type: DataTypes.INTEGER, primaryKey: true },
            },
            {
                sequelize,
                tableName: "user_roles",
                underscored: true,
                timestamps: false,
                indexes: [{ fields: ["user_id"] }, { fields: ["role_id"] }],
            }
        );
    }

    static associate(models: Models) {
        UserRole.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        UserRole.belongsTo(models.Role, { foreignKey: "role_id", as: "role" });
    }
}

export default UserRole;
