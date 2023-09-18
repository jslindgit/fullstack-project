import { Op } from 'sequelize';

import { Item as ItemModel } from '../models/item';
import { NewItem } from '../types/types';
import { isNumber, isObject } from '../types/type_functions';
import { handleError } from '../util/error_handler';

const addItem = async (newItem: NewItem): Promise<ItemModel | null> => {
    try {
        const item = await ItemModel.create(newItem);
        await item.save();
        return item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteItemById = async (id: unknown): Promise<ItemModel | null> => {
    try {
        const item = await getItemById(id);
        if (item) {
            await item.destroy();
        }
        return item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getItemById = async (id: unknown): Promise<ItemModel | null> => {
    try {
        const item = isNumber(Number(id))
            ? await ItemModel.findByPk(Number(id))
            : null;
        return item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getItems = async (
    searchQuery: string = ''
): Promise<Array<ItemModel> | null> => {
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

        const items = await ItemModel.findAll({
            where,
        });

        return items;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const updateItem = async (
    id: unknown,
    props: unknown
): Promise<ItemModel | null> => {
    try {
        const item = await getItemById(id);
        if (item) {
            if (isObject(props)) {
                if ('stockbalance' in props) {
                    if (isNumber(props.stockbalance)) {
                        item.setDataValue('stockbalance', props.stockbalance);
                    } else {
                        throw new Error('Invalid value for stockbalance');
                    }
                }

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
    addItem,
    deleteItemById,
    getItemById,
    getItems,
    updateItem,
};
