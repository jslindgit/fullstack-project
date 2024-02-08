"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const order_1 = __importDefault(require("../models/order"));
const error_handler_1 = require("../util/error_handler");
const type_functions_1 = require("../types/type_functions");
const addNew = async (newOrder) => {
    try {
        const order = await order_1.default.create(newOrder);
        await order.save();
        return order;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const deleteById = async (id) => {
    try {
        const order = await getById(id);
        if (order) {
            await order.destroy();
        }
        return order;
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
                        id: {
                            [sequelize_1.Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        customerFirstName: {
                            [sequelize_1.Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        customerLastName: {
                            [sequelize_1.Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }
        const orders = await order_1.default.findAll({
            where,
            order: [['created_at', 'DESC']],
        });
        return orders;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return [];
    }
};
const getById = async (id) => {
    try {
        const order = (0, type_functions_1.isNumber)(Number(id)) ? await order_1.default.findByPk(Number(id)) : null;
        return order;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const update = async (id, props) => {
    try {
        const order = await getById(id);
        if (order) {
            if ((0, type_functions_1.isObject)(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in order && key !== 'id') {
                        order.setDataValue(key, props[key]);
                    }
                    else if (key !== 'id') {
                        console.warn(`Invalid property '${key}' for Order`);
                    }
                });
                await order.save();
            }
            else {
                (0, error_handler_1.handleError)(new Error('Invalid props value (not an object)'));
            }
        }
        else {
            console.warn(`Order with id ${id} not found.`);
        }
        return order;
    }
    catch (err) {
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
