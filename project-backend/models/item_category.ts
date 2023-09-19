import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

export class Item_Category extends Model {}

Item_Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'items', key: 'id' },
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'categories', key: 'id' },
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'item_category',
    }
);
