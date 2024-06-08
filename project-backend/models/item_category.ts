import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../util/db';

export interface Item_CategoryAttributes {
    id: number;
    itemId: number;
    categoryId: number;
}

export type NewItem_Category = Omit<Item_CategoryAttributes, 'id'>;

interface Item_CategoryCreationAttributes extends Optional<Item_CategoryAttributes, 'id'> {}

export interface Item_CategoryInstance extends Model<Item_CategoryAttributes, Item_CategoryCreationAttributes>, Item_CategoryAttributes {}

const Item_Category = sequelize.define<Item_CategoryInstance>(
    'item_category',
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
        underscored: true,
        timestamps: true,
    }
);

export default Item_Category;
