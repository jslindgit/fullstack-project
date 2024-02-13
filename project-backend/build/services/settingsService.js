"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = __importDefault(require("../models/settings"));
const error_handler_1 = require("../util/error_handler");
const type_functions_1 = require("../types/type_functions");
const addNew = async (newSettings) => {
    try {
        const settings = await settings_1.default.create(newSettings);
        await settings.save();
        return settings;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const deleteById = async (id) => {
    try {
        const settings = await getById(id);
        if (settings) {
            await settings.destroy();
        }
        return settings;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const getAll = async () => {
    try {
        const settings = await settings_1.default.findAll();
        return settings;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
// prettier-ignore
const getById = async (id) => {
    try {
        const settings = (0, type_functions_1.isNumber)(Number(id))
            ? await settings_1.default.findByPk(Number(id))
            : null;
        return settings;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const update = async (id, props) => {
    try {
        const settings = await getById(id);
        if (settings) {
            if ((0, type_functions_1.isObject)(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in settings && key !== 'id') {
                        settings.setDataValue(key, props[key]);
                    }
                    else {
                        throw new Error(`Invalid property '${key}' for Settings`);
                    }
                });
                await settings.save();
            }
            else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return settings;
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
