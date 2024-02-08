"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewCategory = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../util/db");
const type_functions_1 = require("../types/type_functions");
const Category = db_1.sequelize.define('category', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    addedBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    underscored: true,
    timestamps: true,
});
const isNewCategory = (obj) => {
    if (obj === null || !(0, type_functions_1.isObject)(obj)) {
        return false;
    }
    else {
        return 'name' in obj && (0, type_functions_1.isString)(obj.name);
    }
};
exports.isNewCategory = isNewCategory;
exports.default = Category;
