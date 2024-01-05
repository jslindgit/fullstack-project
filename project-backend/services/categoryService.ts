import { Op } from 'sequelize';

import Category, { CategoryAttributes, CategoryInstance, NewCategory } from '../models/category';
import Item from '../models/item';

import { handleError } from '../util/error_handler';
import { isNumber, isObject } from '../types/type_functions';
import item_categoryService from './item_categoryService';

const addNew = async (newCategory: NewCategory): Promise<CategoryInstance | null> => {
    try {
        const category = await Category.create(newCategory);
        await category.save();
        return category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<CategoryInstance | null> => {
    try {
        const category = await getById(id);
        if (category) {
            // First delete the connection tables involving this Category:
            await item_categoryService.deleteByCategoryId(category.id);

            await category.destroy();
        }
        return category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (searchQuery: string = ''): Promise<Array<CategoryInstance> | null> => {
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

        const categories = await Category.findAll({
            include: [
                {
                    model: Item,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'description', 'images', 'instock', 'price', 'sizes', 'sold'],
                    include: [
                        {
                            model: Category,
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
            where,
            order: [
                ['name', 'ASC'],
                [Item, 'name', 'ASC'],
            ],
        });

        return categories;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

// prettier-ignore
const getById = async (id: unknown): Promise<CategoryInstance | null> => {
    try {
        const category = isNumber(Number(id))
            ? await Category.findByPk(Number(id), {
                include: [
                    {
                        model: Item,
                        through: { attributes: [] },
                        attributes: ['id', 'name', 'description', 'price', 'images', 'instock'],
                        include: [
                            {
                                model: Category,
                                through: { attributes: [] },
                            },
                        ],
                    },
                ],
            })
            : null;
        return category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (id: unknown, props: unknown): Promise<CategoryInstance | null> => {
    try {
        const category = await getById(id);
        if (category) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in category && key !== 'id') {
                        category.setDataValue(key as keyof CategoryAttributes, props[key as keyof typeof props]);
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
