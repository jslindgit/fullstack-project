import { Item_Category } from '../models';
import { NewItem_Category } from '../types/types';
import { isNumber } from '../types/type_functions';
import { handleError } from '../util/error_handler';

const addNew = async (newItem_Category: NewItem_Category): Promise<Item_Category | null> => {
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
        const item_categories = await Item_Category.findAll({ where: { category_id: categoryId } });

        const promises = item_categories.map(async (ic) => await ic.destroy());
        await Promise.all(promises);
    } catch (err: unknown) {
        handleError(err);
    }
};

const deleteByItemAndCategoryId = async (itemId: unknown, categoryId: unknown): Promise<Item_Category | null> => {
    try {
        const item_category =
            isNumber(itemId) && isNumber(categoryId) ? await Item_Category.findOne({ where: { item_id: itemId, category_id: categoryId } }) : null;
        if (item_category) {
            await item_category.destroy();
        }
        return item_category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteByItemId = async (itemId: unknown) => {
    try {
        const item_categories = await Item_Category.findAll({ where: { item_id: itemId } });

        const promises = item_categories.map(async (ic) => await ic.destroy());
        await Promise.all(promises);
    } catch (err: unknown) {
        handleError(err);
    }
};

const getAll = async (): Promise<Array<Item_Category> | null> => {
    try {
        return await Item_Category.findAll();
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

export default {
    addNew,
    deleteByCategoryId,
    //deleteById,
    deleteByItemAndCategoryId,
    deleteByItemId,
    getAll,
    //getById,
    //getByItemAndCategoryId,
};

/*const deleteById = async (id: unknown): Promise<Item_Category | null> => {
    try {
        const item_category = await getById(id);
        if (item_category) {
            await item_category.destroy();
        }
        return item_category;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};*/

/*const getById = async (id: unknown): Promise<Item_Category | null> => {
    try {
        return isNumber(Number(id)) ? await Item_Category.findByPk(Number(id)) : null;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};*/

/*const getByItemAndCategoryId = async (itemId: unknown, categoryId: unknown): Promise<Item_Category | null> => {
    try {
        return isNumber(itemId) && isNumber(categoryId) ? await Item_Category.findOne({ where: { item_id: itemId, category_id: categoryId } }) : null;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};*/
