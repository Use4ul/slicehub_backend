import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from './index';

interface ModelCategoryAttributes {
  id: number;
  name: string;
  description: string;
  parent_id?: number;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

interface ModelCategoryCreationAttributes extends Optional<ModelCategoryAttributes, 'id'> {}

export class ModelCategory extends Model<ModelCategoryAttributes, ModelCategoryCreationAttributes> implements ModelCategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public parent_id?: number;
  public slug!: string;
  public is_active!: boolean;
  public sort_order!: number;

  static initialize(sequelize: Sequelize) {
    return ModelCategory.init({
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      parent_id: { type: DataTypes.INTEGER, allowNull: true },
      slug: { type: DataTypes.STRING(255), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    }, {
      sequelize,
      tableName: 'model_categories',
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ['parent_id'] },
        { fields: ['slug'] },
        { fields: ['is_active'] },
        { fields: ['sort_order'] }
      ]
    });
  }

  static associate(models: Models) {
    ModelCategory.belongsTo(models.ModelCategory, { foreignKey: 'parent_id', as: 'parent' });
    ModelCategory.hasMany(models.ModelCategory, { foreignKey: 'parent_id', as: 'children' });
    ModelCategory.hasMany(models.Model3d, { foreignKey: 'category_id', as: 'models' });
  }
}

export default ModelCategory;