import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

export class Image_Item extends Model {}

Image_Item.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        imageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'images', key: 'id' },
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'items', key: 'id' },
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'image_item',
    }
);
