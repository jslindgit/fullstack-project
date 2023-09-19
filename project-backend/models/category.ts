import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

export class Category extends Model {}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'category',
    }
);
