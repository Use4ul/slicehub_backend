import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface AuthIdentityAttributes {
  id: string;
  user_id: string;
  provider_id: number;
  provider_user_id: string;
}

interface AuthIdentityCreationAttributes extends Optional<AuthIdentityAttributes, 'id'> {}

export class AuthIdentity extends Model<AuthIdentityAttributes, AuthIdentityCreationAttributes> implements AuthIdentityAttributes {
  public id!: string;
  public user_id!: string;
  public provider_id!: number;
  public provider_user_id!: string;

  static initialize(sequelize: Sequelize) {
    return AuthIdentity.init({
      id: { type: DataTypes.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      provider_id: { type: DataTypes.INTEGER, allowNull: false },
      provider_user_id: { type: DataTypes.STRING(32), allowNull: false },
    }, {
      sequelize,
      tableName: 'auth_identities',
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ['provider_id', 'provider_user_id'], unique: true }
      ]
    });
  }

  static associate(models: Models) {
    AuthIdentity.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    AuthIdentity.belongsTo(models.AuthProvider, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default AuthIdentity;