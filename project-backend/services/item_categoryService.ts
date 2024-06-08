import { Item_Category } from '../models';
import { Item_CategoryInstance, NewItem_Category } from '../models/item_category';
import { isNumber } from '../types/type_functions';
import { handleError } from '../util/error_handler';

const addNew = async (newItem_Category: NewItem_Category): Promise<Item_CategoryInstance | null> => {
    try {
        const item_category = await Item_Category.create(newItem_Category);
        await item_category.save();

        return item_category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteByCategoryId = async (categoryId: number) => {
    try {
        const item_categories = await Item_Category.findAll({ where: { categoryId: categoryId } });

        const promises = item_categories.map(async (ic) => await ic.destroy());
        await Promise.all(promises);
    } catch (err: unknown) {
        handleError(err);
    }
};

const deleteById = async (id: unknown): Promise<void> => {
    try {
        if (isNumber(id)) {
            const item_category = await Item_Category.findByPk(id);

            if (item_category) {
                await item_category.destroy();
            }
        } else {
            handleError(new Error('id must be number'));
        }
    } catch (err: unknown) {
        handleError(err);
    }
};

const deleteByItemId = async (itemId: unknown) => {
    try {
        if (isNumber(itemId)) {
            const item_categories = await Item_Category.findAll({ where: { itemId: itemId } });

            const promises = item_categories.map(async (ic) => await ic.destroy());
            await Promise.all(promises);
        } else {
            handleError(new Error('itemid must be number'));
        }
    } catch (err: unknown) {
        handleError(err);
    }
};

const getByItemId = async (itemId: number): Promise<Item_CategoryInstance[]> => {
    try {
        return await Item_Category.findAll({ where: { itemId: itemId } });
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

export default {
    addNew,
    deleteByCategoryId,
    deleteById,
    deleteByItemId,
    getByItemId,
};
