import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface AuthProviderAttributes {
  id: number;
  name: string;
  display_name: string;
  is_enabled: boolean;
  protocol: string;
  config: object;
  created_at: Date;
}

interface AuthProviderCreationAttributes extends Optional<AuthProviderAttributes, 'id' | 'created_at'> {}

export class AuthProvider extends Model<AuthProviderAttributes, AuthProviderCreationAttributes> implements AuthProviderAttributes {
  public id!: number;
  public name!: string;
  public display_name!: string;
  public is_enabled!: boolean;
  public protocol!: string;
  public config!: object;
  public created_at!: Date;

  static initialize(sequelize: Sequelize) {
    return AuthProvider.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(32), allowNull: false, unique: true },
      display_name: { type: DataTypes.STRING(32), allowNull: false },
      is_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      protocol: { type: DataTypes.STRING(16), allowNull: false, defaultValue: 'oauth2' },
      config: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, {
      sequelize,
      tableName: 'auth_providers',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        { fields: ['name'] },
        { fields: ['is_enabled'] }
      ]
    });
  }

  static associate(models: Models) {
    AuthProvider.hasMany(models.AuthIdentity, { foreignKey: 'provider_id', as: 'identities' });
  }
}

export default AuthProvider;