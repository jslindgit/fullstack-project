import { Op } from 'sequelize';

import { Category, Item } from '../models';
import { NewItem, ItemAttributes, ItemInstance } from '../models/item';
import { NewItem_Category } from '../models/item_category';

import item_category_service from './item_categoryService';
import { testItemId } from '../constants';
import { handleError } from '../util/error_handler';
import { isNumber, isObject, toNewItem_Category } from '../types/type_functions';

const addNew = async (newItem: NewItem, category_ids: number[]): Promise<ItemInstance | null> => {
    try {
        const item = await Item.create(newItem);
        await item.save();

        for (const categoryId of category_ids) {
            const newItem_Category: NewItem_Category = toNewItem_Category({ item_id: item.id, category_id: categoryId });
            await item_category_service.addNew(newItem_Category);
        }

        return item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<ItemInstance | null> => {
    try {
        const item = await getById(id);

        // Item with id 89 is needed for E2E tests, so it can't be deleted:
        if (item && item.id !== testItemId) {
            // First delete the connection tables involving this Item:
            await item_category_service.deleteByItemId(item.id);

            // Then delete the Item:
            await item.destroy();

            return item;
        } else {
            return null;
        }
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (searchQuery: string = ''): Promise<Array<ItemInstance> | null> => {
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
const getById = async (id: unknown): Promise<ItemInstance | null> => {
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

const update = async (id: unknown, props: unknown, categoryIds: number[] | null): Promise<ItemInstance | null> => {
    try {
        const item = await getById(id);

        // Item with id 89 is needed for E2E tests, so it can't be modified:
        if (item && item.id !== testItemId) {
            if (isObject(props)) {
                Object.keys(props)
                    .filter((key) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'categories' && key !== 'category_ids')
                    .forEach((key) => {
                        if (key in item) {
                            item.setDataValue(key as keyof ItemAttributes, props[key as keyof typeof props]);
                        } else {
                            throw new Error(`Invalid property '${key}' for Item`);
                        }
                    });

                await item.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }

            // If 'categoryIds' is provided, set those as the Item's categories (if it isn't, leave the categories as they are):
            if (categoryIds) {
                const currentConnections = await item_category_service.getByItemId(item.id);

                for (const item_category of currentConnections.filter((ic) => !categoryIds.includes(ic.categoryId))) {
                    await item_category_service.deleteById(item_category.id);
                }

                for (const idToAdd of categoryIds.filter((id) => !currentConnections.find((item_category) => item_category.categoryId === id))) {
                    const newItem_Category: NewItem_Category = { categoryId: idToAdd, itemId: item.id };

                    await item_category_service.addNew(newItem_Category);
                }
            }

            return item;
        } else {
            return null;
        }
    } catch (err: unknown) {
        console.error(err);
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
