"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewItem = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../util/db");
const type_functions_1 = require("../types/type_functions");
const Item = db_1.sequelize.define('item', {
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
    fitsInLetter: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    instock: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    images: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: [],
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    sizes: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: [],
    },
    sold: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    underscored: true,
    timestamps: true,
});
const isNewItem = (obj) => {
    if (obj === null || !(0, type_functions_1.isObject)(obj)) {
        return false;
    }
    else {
        return ('description' in obj &&
            (0, type_functions_1.isString)(obj.description) &&
            'instock' in obj &&
            (0, type_functions_1.isNumber)(obj.instock) &&
            'name' in obj &&
            (0, type_functions_1.isString)(obj.name) &&
            'price' in obj &&
            (0, type_functions_1.isNumber)(obj.price));
    }
};
exports.isNewItem = isNewItem;
exports.default = Item;
