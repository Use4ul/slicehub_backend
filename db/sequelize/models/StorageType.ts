import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface StorageTypeAttributes {
  id: number;
  name: string;
  description: string;
  requires_url_processing: boolean;
}

interface StorageTypeCreationAttributes extends Optional<StorageTypeAttributes, 'id'> {}

export class StorageType extends Model<StorageTypeAttributes, StorageTypeCreationAttributes> implements StorageTypeAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public requires_url_processing!: boolean;

  static initialize(sequelize: Sequelize) {
    return StorageType.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      requires_url_processing: { type: DataTypes.BOOLEAN, allowNull: false },
    }, {
      sequelize,
      tableName: 'storage_types',
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ['requires_url_processing'] },
        { fields: ['name', 'requires_url_processing'] }
      ]
    });
  }

  static associate(models: Models) {
    StorageType.hasMany(models.Profile, { foreignKey: 'avatar_storage_type', as: 'profiles' });
    StorageType.hasMany(models.ModelFile, { foreignKey: 'storage_type_id', as: 'model_files' });
    StorageType.hasMany(models.ModelPreview, { foreignKey: 'storage_type_id', as: 'model_previews' });
  }
}

export default StorageType;