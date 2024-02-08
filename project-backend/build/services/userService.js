"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const user_1 = __importStar(require("../models/user"));
const error_handler_1 = require("../util/error_handler");
const type_functions_1 = require("../types/type_functions");
const addNew = async (newUser) => {
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(newUser.password, saltRounds);
        const user = await user_1.default.create({ ...newUser, passwordHash: passwordHash });
        await user.save();
        return (0, user_1.removePasswordHash)(user);
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const deleteById = async (id) => {
    try {
        const user = (0, type_functions_1.isNumber)(Number(id)) ? await user_1.default.findByPk(Number(id)) : null;
        if (user) {
            await user.destroy();
        }
        return (0, user_1.removePasswordHash)(user);
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
                        username: {
                            [sequelize_1.Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        name: {
                            [sequelize_1.Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }
        const users = await user_1.default.findAll({
            include: [
                {
                    model: models_1.Order,
                    //attributes: ['id', 'createdAt', 'items', 'status', 'totalAmount'],
                },
            ],
            where,
            order: [['username', 'ASC']],
        });
        return users.map((user) => (0, user_1.removePasswordHash)(user));
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return [];
    }
};
// prettier-ignore
const getById = async (id) => {
    try {
        const user = (0, type_functions_1.isNumber)(Number(id))
            ? await user_1.default.findByPk(Number(id), {
                include: [
                    {
                        model: models_1.Order,
                        //attributes: ['id', 'createdAt', 'items', 'status', 'totalAmount'],
                    },
                ],
            })
            : null;
        return (0, user_1.removePasswordHash)(user);
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const update = async (id, props) => {
    try {
        const user = (0, type_functions_1.isNumber)(Number(id)) ? await user_1.default.findByPk(Number(id)) : null;
        if (user) {
            if ((0, type_functions_1.isObject)(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in user && key !== 'id') {
                        user.setDataValue(key, props[key]);
                    }
                    else {
                        throw new Error(`Invalid property '${key}' for User`);
                    }
                });
                await user.save();
            }
            else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return (0, user_1.removePasswordHash)(user);
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
