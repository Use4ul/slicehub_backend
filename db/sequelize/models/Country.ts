import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface CountryAttributes {
  id: number;
  name: string;
  iso_code: string;
  phone_code: string;
  is_active: boolean;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, 'id'> {}

export class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
  public id!: number;
  public name!: string;
  public iso_code!: string;
  public phone_code!: string;
  public is_active!: boolean;

  static initialize(sequelize: Sequelize) {
    return Country.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      iso_code: { type: DataTypes.STRING(3), allowNull: false, unique: true },
      phone_code: { type: DataTypes.STRING(10), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    }, {
      sequelize,
      tableName: 'countries',
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ['is_active'] }
      ]
    });
  }

  static associate(models: Models) {
    Country.hasMany(models.City, { foreignKey: 'country_id', as: 'cities' });
    Country.hasMany(models.Profile, { foreignKey: 'country_id', as: 'profiles' });
  }
}

export default Country;