import { DataTypes, Model, Sequelize } from 'sequelize';
import { Models } from './index';

interface ModelTagAttributes {
  model_id: string;
  tag_id: number;
}

export class ModelTag extends Model<ModelTagAttributes> implements ModelTagAttributes {
  public model_id!: string;
  public tag_id!: number;

  static initialize(sequelize: Sequelize) {
    return ModelTag.init({
      model_id: { type: DataTypes.UUID, primaryKey: true },
      tag_id: { type: DataTypes.BIGINT, primaryKey: true },
    }, {
      sequelize,
      tableName: 'model_tags',
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ['tag_id'] }
      ]
    });
  }

  static associate(models: Models) {
    ModelTag.belongsTo(models.Model3d, { foreignKey: 'model_id', as: 'model' });
    ModelTag.belongsTo(models.Tag, { foreignKey: 'tag_id', as: 'tag' });
  }
}

export default ModelTag;