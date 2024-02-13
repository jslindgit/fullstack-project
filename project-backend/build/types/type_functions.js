"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewSettings = exports.toNewItem_Category = exports.toNewItem = exports.toNewCategory = exports.toCredentials = exports.isString = exports.isObject = exports.isNumber = exports.isBuffer = exports.isBoolean = void 0;
const category_1 = require("../models/category");
const item_1 = require("../models/item");
const settings_1 = require("../models/settings");
const isBoolean = (text) => {
    return typeof text === 'boolean' || text instanceof Boolean;
};
exports.isBoolean = isBoolean;
const isBuffer = (data) => {
    return Buffer.isBuffer(data);
};
exports.isBuffer = isBuffer;
const isNumber = (text) => {
    return typeof text === 'number' || text instanceof Number;
};
exports.isNumber = isNumber;
const isObject = (variable) => {
    return typeof variable === 'object' || variable instanceof Object;
};
exports.isObject = isObject;
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
exports.isString = isString;
const parseNumber = (value, fieldName) => {
    if (!value || !(0, exports.isNumber)(value)) {
        throw new Error(`Incorrect or missing value for ${fieldName}: "${value}"`);
    }
    return value;
};
const parseString = (value, fieldName) => {
    if (!value || !(0, exports.isString)(value)) {
        throw new Error(`Incorrect or missing value for ${fieldName}: "${value}"`);
    }
    return value;
};
const toCredentials = (object) => {
    if (!(0, exports.isObject)(object)) {
        throw new Error('Incorrect or missing data for toCredentials');
    }
    if ('username' in object && 'password' in object) {
        const credentials = {
            username: parseString(object.username, 'username'),
            password: parseString(object.password, 'password'),
        };
        return credentials;
    }
    throw new Error('Incorrect data: some fields ("username" or "password") are missing for toNewItem');
};
exports.toCredentials = toCredentials;
const toNewCategory = (object) => {
    if (!(0, category_1.isNewCategory)(object)) {
        throw new Error('Incorrect or missing data for toNewCategory');
    }
    else {
        return object;
    }
};
exports.toNewCategory = toNewCategory;
const toNewItem = (object) => {
    if (!(0, item_1.isNewItem)(object)) {
        throw new Error('Incorrect or missing data for toNewItem');
    }
    else {
        return object;
    }
};
exports.toNewItem = toNewItem;
const toNewItem_Category = (object) => {
    if (!(0, exports.isObject)(object)) {
        throw new Error('Incorrect or missing data for toNewItem_Category');
    }
    if ('item_id' in object && 'category_id' in object) {
        const newItem_Category = {
            itemId: parseNumber(object.item_id, 'item_id'),
            categoryId: parseNumber(object.category_id, 'category_id'),
        };
        return newItem_Category;
    }
    throw new Error('Incorrect data: some fields ("item_id" or "category_id") are missing for toNewItem_Category');
};
exports.toNewItem_Category = toNewItem_Category;
const toNewSettings = (object) => {
    if (!(0, settings_1.isNewSettings)(object)) {
        throw new Error('Incorrect or missing data for toNewSettings');
    }
    else {
        return object;
    }
};
exports.toNewSettings = toNewSettings;
