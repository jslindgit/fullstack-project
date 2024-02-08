"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const type_functions_1 = require("../types/type_functions");
const error_handler_1 = require("../util/error_handler");
const addNew = async (newItem_Category) => {
    try {
        const item_category = await models_1.Item_Category.create(newItem_Category);
        await item_category.save();
        return item_category;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const deleteByCategoryId = async (categoryId) => {
    try {
        const item_categories = await models_1.Item_Category.findAll({ where: { category_id: categoryId } });
        const promises = item_categories.map(async (ic) => await ic.destroy());
        await Promise.all(promises);
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
    }
};
const deleteByItemAndCategoryId = async (itemId, categoryId) => {
    try {
        const item_category = (0, type_functions_1.isNumber)(itemId) && (0, type_functions_1.isNumber)(categoryId) ? await models_1.Item_Category.findOne({ where: { item_id: itemId, category_id: categoryId } }) : null;
        if (item_category) {
            await item_category.destroy();
        }
        return item_category;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const deleteByItemId = async (itemId) => {
    try {
        const item_categories = await models_1.Item_Category.findAll({ where: { item_id: itemId } });
        const promises = item_categories.map(async (ic) => await ic.destroy());
        await Promise.all(promises);
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
    }
};
const getAll = async () => {
    try {
        return await models_1.Item_Category.findAll();
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
exports.default = {
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
