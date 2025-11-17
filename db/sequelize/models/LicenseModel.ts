import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface LicenseModelAttributes {
    id: number;
    model_id: string;
    license_id?: number;
    is_primary: boolean;
}

interface LicenseModelCreationAttributes extends Optional<LicenseModelAttributes, "id"> {}

export class LicenseModel extends Model<LicenseModelAttributes, LicenseModelCreationAttributes> implements LicenseModelAttributes {
    public id!: number;
    public model_id!: string;
    public license_id?: number;
    public is_primary!: boolean;

    static initialize(sequelize: Sequelize) {
        return LicenseModel.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                model_id: { type: DataTypes.UUID, allowNull: false },
                license_id: { type: DataTypes.INTEGER, allowNull: true },
                is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            },
            {
                sequelize,
                tableName: "licenses_model",
                underscored: true,
                timestamps: false,
                indexes: [
                    {
                        unique: true,
                        fields: ["model_id", "license_id"],
                        name: "licenses_model_unique",
                    },
                ],
            }
        );
    }

    static associate(models: Models) {
        LicenseModel.belongsTo(models.ThreeDModel, { foreignKey: "model_id", as: "model" });
        LicenseModel.belongsTo(models.License, { foreignKey: "license_id", as: "license" });
    }
}

export default LicenseModel;

