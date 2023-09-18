import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

export class Item extends Model {}

Item.init(
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
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        stockbalance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'item',
    }
);
