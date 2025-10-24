import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "./index";

interface ModelLicenseAttributes {
    id: number;
    model_id: string;
    license_id?: number;
    is_primary: boolean;
}

interface ModelLicenseCreationAttributes extends Optional<ModelLicenseAttributes, "id"> {}

export class ModelLicense extends Model<ModelLicenseAttributes, ModelLicenseCreationAttributes> implements ModelLicenseAttributes {
    public id!: number;
    public model_id!: string;
    public license_id?: number;
    public is_primary!: boolean;

    static initialize(sequelize: Sequelize) {
        return ModelLicense.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                model_id: { type: DataTypes.UUID, allowNull: false },
                license_id: { type: DataTypes.INTEGER, allowNull: true },
                is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            },
            {
                sequelize,
                tableName: "model_licenses",
                underscored: true,
                timestamps: false,
                indexes: [
                    {
                        unique: true,
                        fields: ["model_id", "license_id"],
                        name: "model_licenses_unique",
                    },
                ],
            }
        );
    }

    static associate(models: Models) {
        ModelLicense.belongsTo(models.Model3d, { foreignKey: "model_id", as: "model" });
        ModelLicense.belongsTo(models.License, { foreignKey: "license_id", as: "license" });
    }
}

export default ModelLicense;
