import { Op } from 'sequelize';

import { Category as CategoryModel } from '../models/category';
import { NewCategory } from '../types/types';
import { isNumber, isObject } from '../types/type_functions';
import { handleError } from '../util/error_handler';

const addNew = async (newCategory: NewCategory): Promise<CategoryModel | null> => {
    try {
        const category = await CategoryModel.create(newCategory);
        await category.save();
        return category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<CategoryModel | null> => {
    try {
        const category = await getById(id);
        if (category) {
            await category.destroy();
        }
        return category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (searchQuery: string = ''): Promise<Array<CategoryModel> | null> => {
    try {
        let where = {};
        if (searchQuery && searchQuery.length > 0) {
            where = {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }

        const categories = await CategoryModel.findAll({
            where,
        });

        return categories;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getById = async (id: unknown): Promise<CategoryModel | null> => {
    try {
        const category = isNumber(Number(id)) ? await CategoryModel.findByPk(Number(id)) : null;
        return category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (id: unknown, props: unknown): Promise<CategoryModel | null> => {
    try {
        const category = await getById(id);
        if (category) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in category) {
                        category.setDataValue(key, props[key as keyof typeof props]);
                    } else {
                        throw new Error(`Invalid property '${key}' for Category`);
                    }
                });

                await category.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

export default {
    addNew,
    deleteById,
    getAll,
    getById,
    update,
};
