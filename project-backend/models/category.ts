import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../util/db';
import { isObject, isString } from '../types/type_functions';

export interface CategoryAttributes {
    id: number;
    addedBy?: number;
    description?: string;
    name: string;
}

export type NewCategory = Omit<CategoryAttributes, 'id'>;

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {
    description?: string;
}

export interface CategoryInstance extends Model<CategoryAttributes, CategoryCreationAttributes>, CategoryAttributes {}

const Category = sequelize.define<CategoryInstance>(
    'category',
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
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    },
    {
        underscored: true,
        timestamps: true,
    }
);

export const isNewCategory = (obj: unknown): obj is NewCategory => {
    if (obj === null || !isObject(obj)) {
        return false;
    } else {
        return 'name' in obj && isString(obj.name);
    }
};

export default Category;
