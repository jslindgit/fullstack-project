import { Op } from 'sequelize';

import { Item as ItemModel } from '../models/item';
import { NewItem } from '../types';
import { logError } from '../util/error_logger';

const addItem = async (newItem: NewItem): Promise<ItemModel | null> => {
    try {
        const item = await ItemModel.create(newItem);
        await item.save();

        return item;
    } catch (err: unknown) {
        logError(err);
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
        logError(err);

        return null;
    }
};

export default {
    addItem,
    getItems,
};
