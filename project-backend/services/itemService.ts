import { Op } from 'sequelize';

import { Category, Item } from '../models';
import { NewItem, NewItem_Category } from '../types/types';
import { isNumber, isObject, toNewItem_Category } from '../types/type_functions';
import { handleError } from '../util/error_handler';
import item_category_service from './item_categoryService';

const addNew = async (newItem: NewItem, category_id: number | null): Promise<Item | null> => {
    try {
        const item = await Item.create(newItem);
        await item.save();

        if (category_id && 'id' in item) {
            const newItem_Category: NewItem_Category = toNewItem_Category({ item_id: item.id, category_id: category_id });
            await item_category_service.addNew(newItem_Category);
        }

        return item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<Item | null> => {
    try {
        const item = await getById(id);
        if (item) {
            await item.destroy();
        }
        return item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (searchQuery: string = ''): Promise<Array<Item> | null> => {
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

        const items = await Item.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ],
            where,
            order: [['name', 'ASC']],
        });

        return items;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

// prettier-ignore
const getById = async (id: unknown): Promise<Item | null> => {
    try {
        const item = isNumber(Number(id))
            ? await Item.findByPk(Number(id), {
                include: [
                    {
                        model: Category,
                        through: { attributes: [] },
                    },
                ],
            })
            : null;
        return item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (id: unknown, props: unknown): Promise<Item | null> => {
    try {
        const item = await getById(id);
        if (item) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in item && key !== 'id') {
                        item.setDataValue(key, props[key as keyof typeof props]);
                    } else {
                        throw new Error(`Invalid property '${key}' for Item`);
                    }
                });

                await item.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return item;
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
