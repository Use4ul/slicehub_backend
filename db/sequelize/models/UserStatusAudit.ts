import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface UserStatusAuditAttributes {
  id: number;
  user_id: string;
  old?: number;
  new: number;
  reason: string;
  changed_by: string;
  changed_at: Date;
}

interface UserStatusAuditCreationAttributes extends Optional<UserStatusAuditAttributes, 'id' | 'changed_at'> {}

export class UserStatusAudit extends Model<UserStatusAuditAttributes, UserStatusAuditCreationAttributes> implements UserStatusAuditAttributes {
  public id!: number;
  public user_id!: string;
  public old?: number;
  public new!: number;
  public reason!: string;
  public changed_by!: string;
  public changed_at!: Date;

  static initialize(sequelize: Sequelize) {
    return UserStatusAudit.init({
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      old: { type: DataTypes.INTEGER, allowNull: true },
      new: { type: DataTypes.INTEGER, allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: false },
      changed_by: { type: DataTypes.UUID, allowNull: false },
      changed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, {
      sequelize,
      tableName: 'user_status_audit',
      underscored: true,
      timestamps: true,
      createdAt: 'changed_at',
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['changed_at'] },
        { fields: ['new'] }
      ]
    });
  }

  static associate(models: Models) {
    UserStatusAudit.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user',
      targetKey: 'id'
    });
    UserStatusAudit.belongsTo(models.UserStatus, { 
      foreignKey: 'old', 
      as: 'old_status',
      targetKey: 'id'
    });
    UserStatusAudit.belongsTo(models.UserStatus, { 
      foreignKey: 'new', 
      as: 'new_status',
      targetKey: 'id'
    });
    UserStatusAudit.belongsTo(models.User, { 
      foreignKey: 'changed_by', 
      as: 'changed_by_user',
      targetKey: 'id'
    });
  }
}

export default UserStatusAudit;