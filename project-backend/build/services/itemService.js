"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const type_functions_1 = require("../types/type_functions");
const error_handler_1 = require("../util/error_handler");
const item_categoryService_1 = __importDefault(require("./item_categoryService"));
const addNew = async (newItem, category_id) => {
    try {
        const item = await models_1.Item.create(newItem);
        await item.save();
        if (category_id && 'id' in item) {
            const newItem_Category = (0, type_functions_1.toNewItem_Category)({ item_id: item.id, category_id: category_id });
            await item_categoryService_1.default.addNew(newItem_Category);
        }
        return item;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const deleteById = async (id) => {
    try {
        const item = await getById(id);
        if (item) {
            // First delete the connection tables involving this Item:
            await item_categoryService_1.default.deleteByItemId(id);
            // Then delete the Item:
            await item.destroy();
        }
        return item;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const getAll = async (searchQuery = '') => {
    try {
        let where = {};
        if (searchQuery && searchQuery.length > 0) {
            where = {
                [sequelize_1.Op.or]: [
                    {
                        name: {
                            [sequelize_1.Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }
        const items = await models_1.Item.findAll({
            include: [
                {
                    model: models_1.Category,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ],
            where,
            order: [['name', 'ASC']],
        });
        return items;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
// prettier-ignore
const getById = async (id) => {
    try {
        const item = (0, type_functions_1.isNumber)(Number(id))
            ? await models_1.Item.findByPk(Number(id), {
                include: [
                    {
                        model: models_1.Category,
                        through: { attributes: [] },
                    },
                ],
            })
            : null;
        return item;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const update = async (id, props) => {
    try {
        const item = await getById(id);
        if (item) {
            if ((0, type_functions_1.isObject)(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in item) {
                        if (key !== 'id') {
                            item.setDataValue(key, props[key]);
                        }
                    }
                    else {
                        throw new Error(`Invalid property '${key}' for Item`);
                    }
                });
                await item.save();
            }
            else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return item;
    }
    catch (err) {
        console.error(err);
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
exports.default = {
    addNew,
    deleteById,
    getAll,
    getById,
    update,
};
