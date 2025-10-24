import { Model, Sequelize, DataTypes } from "sequelize";

export class Migration extends Model {
    declare id: number;
    declare name: string;
    declare executed_at: Date;

    static initialize(sequelize: Sequelize) {
        return Migration.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                executed_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            {
                sequelize,
                tableName: "migrations",
                underscored: true,
                timestamps: false,
            }
        );
    }
}

export default Migration;

