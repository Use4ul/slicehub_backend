import { DataTypes, Model, Sequelize } from "sequelize";
import { Models } from "./index";

interface ModelLicenseAttributes {
    model_id: string;
    license_id: number;
    is_primary: boolean;
}

export class ModelLicense extends Model<ModelLicenseAttributes> implements ModelLicenseAttributes {
    public model_id!: string;
    public license_id!: number;
    public is_primary!: boolean;

    static initialize(sequelize: Sequelize) {
        return ModelLicense.init(
            {
                model_id: { type: DataTypes.UUID, primaryKey: true },
                license_id: { type: DataTypes.INTEGER, primaryKey: true },
                is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            },
            {
                sequelize,
                tableName: "model_licenses",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models: Models) {
        ModelLicense.belongsTo(models.Model3d, { foreignKey: "model_id", as: "model" });
        ModelLicense.belongsTo(models.License, { foreignKey: "license_id", as: "license" });
    }
}

export default ModelLicense;
