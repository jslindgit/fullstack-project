import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

export class Image extends Model {}

Image.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        data: {
            type: DataTypes.BLOB('long'),
            allowNull: false,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'image',
    }
);
