import { Op } from 'sequelize';

import { Item } from '../models';
import { NewItem } from '../types/types';
import { isNumber, isObject } from '../types/type_functions';
import { handleError } from '../util/error_handler';
import { Category } from '../models/category';

const addNew = async (newItem: NewItem): Promise<Item | null> => {
    try {
        const item = await Item.create(newItem);
        await item.save();
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
                    through: { attributes: [] },
                },
            ],
            where,
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
                    }
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
                    if (key in item) {
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
