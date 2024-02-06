import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../util/db';
import { isNumber, isObject, isString } from '../types/type_functions';

export interface ItemAttributes {
    id: number;
    addedBy?: number;
    description?: string;
    fitsInLetter: number; // How many pcs of the Item fit in a letter
    images: string[];
    instock: number;
    name: string;
    price: number;
    sizes: string[];
    sold?: number;
}

export type NewItem = Omit<ItemAttributes, 'id'>;

interface ItemCreationAttributes extends Optional<ItemAttributes, 'id'> {
    description?: string;
}

export interface ItemInstance extends Model<ItemAttributes, ItemCreationAttributes>, ItemAttributes {}

const Item = sequelize.define<ItemInstance>(
    'item',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        addedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        fitsInLetter: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        instock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        sizes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
        sold: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        underscored: true,
        timestamps: true,
    }
);

export const isNewItem = (obj: unknown): obj is NewItem => {
    if (obj === null || !isObject(obj)) {
        return false;
    } else {
        return (
            'description' in obj &&
            isString(obj.description) &&
            'instock' in obj &&
            isNumber(obj.instock) &&
            'name' in obj &&
            isString(obj.name) &&
            'price' in obj &&
            isNumber(obj.price)
        );
    }
};

export default Item;
