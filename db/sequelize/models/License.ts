import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface LicenseAttributes {
    id: number;
    name: string;
    description: string;
    url?: string;
    allows_commercial_use: boolean;
    allows_modification: boolean;
    requires_attribution: boolean;
    is_active: boolean;
}

interface LicenseCreationAttributes
    extends Optional<
        LicenseAttributes,
        | "id"
        | "allows_commercial_use"
        | "allows_modification"
        | "requires_attribution"
        | "is_active"
    > {}

export class License
    extends Model<LicenseAttributes, LicenseCreationAttributes>
    implements LicenseAttributes
{
    public id!: number;
    public name!: string;
    public description!: string;
    public url?: string;
    public allows_commercial_use!: boolean;
    public allows_modification!: boolean;
    public requires_attribution!: boolean;
    public is_active!: boolean;

    static initialize(sequelize: Sequelize) {
        return License.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
                description: { type: DataTypes.TEXT, allowNull: false },
                url: { type: DataTypes.TEXT, allowNull: true },
                allows_commercial_use: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                allows_modification: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                requires_attribution: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            },
            {
                sequelize,
                tableName: "licenses",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models: Models) {
        License.belongsToMany(models.ThreeDModel, {
            through: models.LicenseModel,
            foreignKey: "license_id",
            as: "models",
        });
    }
}

export default License;
