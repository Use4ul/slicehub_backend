import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface UserAttributes {
    id: string;
    user_name: string;
    display_name?: string;
    status_id: number;
    email_verified: boolean;
    phone_verified: boolean;
    last_login_at?: Date;
    created_at: Date;
    updated_at: Date;
}

interface UserCreationAttributes
    extends Optional<UserAttributes, "id" | "created_at" | "updated_at"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public user_name!: string;
    public display_name?: string;
    public status_id!: number;
    public email_verified!: boolean;
    public phone_verified!: boolean;
    public last_login_at?: Date;
    public created_at!: Date;
    public updated_at!: Date;

    static initialize(sequelize: Sequelize) {
        return User.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                user_name: {
                    type: DataTypes.STRING(32),
                    allowNull: false,
                    unique: true,
                    validate: {
                        is: {
                            args: /^[a-z0-9_]+$/i,
                            msg: "Username can only contain letters, numbers and underscores",
                        },
                        len: {
                            args: [3, 32],
                            msg: "Username must be between 3 and 32 characters",
                        },
                    },
                },
                display_name: { type: DataTypes.STRING(128), allowNull: true },
                status_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                email_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                phone_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                last_login_at: { type: DataTypes.DATE, allowNull: true },
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
                tableName: "users",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
                indexes: [
                    { fields: ["email_verified"] },
                    { fields: ["phone_verified"] },
                    { fields: ["status_id"] },
                ],
            }
        );
    }

    static associate(models: Models) {
        User.belongsTo(models.UserStatus, {
            foreignKey: "status_id",
            as: "status",
            targetKey: "id",
        });
        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: "user_id",
            as: "roles",
        });
        User.hasOne(models.Profile, { foreignKey: "user_id", as: "profile" });
        User.hasMany(models.UserToken, { foreignKey: "user_id", as: "tokens" });
        User.hasMany(models.AuthIdentity, { foreignKey: "user_id", as: "auth_identities" });
        User.hasMany(models.Model3d, { foreignKey: "user_id", as: "models" });
        User.hasMany(models.ModelComment, { foreignKey: "user_id", as: "comments" });
        User.hasMany(models.ModelRating, { foreignKey: "user_id", as: "ratings" });
        User.hasMany(models.Collection, { foreignKey: "user_id", as: "collections" });
        User.hasMany(models.UserStatusAudit, {
            foreignKey: "changed_by",
            as: "status_changes_made",
        });
    }
}

export default User;
