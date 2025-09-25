import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface CityAttributes {
  id: number;
  country_id: number;
  name: string;
  name_en: string;
  population?: number;
  timezone: string;
  is_active: boolean;
}

interface CityCreationAttributes extends Optional<CityAttributes, 'id'> {}

export class City extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  public id!: number;
  public country_id!: number;
  public name!: string;
  public name_en!: string;
  public population?: number;
  public timezone!: string;
  public is_active!: boolean;

  static initialize(sequelize: Sequelize) {
    return City.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      country_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      name_en: { type: DataTypes.STRING(100), allowNull: false },
      population: { type: DataTypes.INTEGER, allowNull: true },
      timezone: { type: DataTypes.STRING(50), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    }, {
      sequelize,
      tableName: 'cities',
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ['country_id'] },
        { fields: ['name'] },
        { fields: ['is_active'] },
        { fields: ['population'] }
      ]
    });
  }

  static associate(models: Models) {
    City.belongsTo(models.Country, { 
      foreignKey: 'country_id', 
      as: 'country',
      targetKey: 'id'
    });
    City.hasMany(models.Profile, { foreignKey: 'city_id', as: 'profiles' });
  }
}

export default City;