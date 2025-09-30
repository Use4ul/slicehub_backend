import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface ProfileAttributes {
    id: string;
    user_id: string;
    avatar_filename?: string;
    avatar_storage_type: number;
    first_name?: string;
    last_name?: string;
    country_id?: number;
    city_id?: number;
    timezone?: string;
    contact_email?: string;
    contact_phone?: string;
    address: object;
    about?: string;
    created_at: Date;
    updated_at?: Date;
}

interface ProfileCreationAttributes extends Optional<ProfileAttributes, "id" | "created_at"> {}

export class Profile
    extends Model<ProfileAttributes, ProfileCreationAttributes>
    implements ProfileAttributes
{
    public id!: string;
    public user_id!: string;
    public avatar_filename?: string;
    public avatar_storage_type!: number;
    public first_name?: string;
    public last_name?: string;
    public country_id?: number;
    public city_id?: number;
    public timezone?: string;
    public contact_email?: string;
    public contact_phone?: string;
    public address!: object;
    public about?: string;
    public created_at!: Date;
    public updated_at?: Date;

    static initialize(sequelize: Sequelize) {
        return Profile.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.literal("gen_random_uuid()"),
                    primaryKey: true,
                },
                user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
                avatar_filename: { type: DataTypes.TEXT, allowNull: true },
                avatar_storage_type: { type: DataTypes.INTEGER, allowNull: false },
                first_name: { type: DataTypes.STRING(64), allowNull: true },
                last_name: { type: DataTypes.STRING(64), allowNull: true },
                country_id: { type: DataTypes.INTEGER, allowNull: true },
                city_id: { type: DataTypes.INTEGER, allowNull: true },
                timezone: { type: DataTypes.STRING(64), allowNull: true },
                contact_email: { type: DataTypes.STRING(255), allowNull: true, unique: true },
                contact_phone: { type: DataTypes.STRING(20), allowNull: true, unique: true },
                address: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
                about: { type: DataTypes.TEXT, allowNull: true },
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
                tableName: "profiles",
                underscored: true,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
                indexes: [
                    { fields: ["avatar_storage_type"] },
                    { fields: ["country_id", "city_id"] },
                ],
            }
        );
    }

    static associate(models: Models) {
        Profile.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        Profile.belongsTo(models.StorageType, {
            foreignKey: "avatar_storage_type",
            as: "storage_type",
        });
        Profile.belongsTo(models.Country, { foreignKey: "country_id", as: "country" });
        Profile.belongsTo(models.City, { foreignKey: "city_id", as: "city" });
    }
}

export default Profile;
