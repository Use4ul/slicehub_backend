import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface UserStatusAttributes {
  id: number;
  name: string;
  description: string;
  allows_login: boolean;
  is_visible: boolean;
  is_terminated: boolean;
}

interface UserStatusCreationAttributes extends Optional<UserStatusAttributes, 'id'> {}

export class UserStatus extends Model<UserStatusAttributes, UserStatusCreationAttributes> implements UserStatusAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public allows_login!: boolean;
  public is_visible!: boolean;
  public is_terminated!: boolean;

  static initialize(sequelize: Sequelize) {
    return UserStatus.init({
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING(16), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(128), allowNull: false },
      allows_login: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_visible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_terminated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }, {
      sequelize,
      tableName: 'user_statuses',
      underscored: true,
      timestamps: false,
    });
  }

  static associate(models: Models) {
    UserStatus.hasMany(models.User, { foreignKey: 'status_id', as: 'users' });
  }
}

export default UserStatus;