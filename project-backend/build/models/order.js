"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrderInstance = exports.isNewOrder = void 0;
const sequelize_1 = require("sequelize");
const type_functions_1 = require("../types/type_functions");
const db_1 = require("../util/db");
const Order = db_1.sequelize.define('order', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerCity: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerCountry: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerEmail: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            isEmail: true,
        },
        allowNull: false,
    },
    customerFirstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerLastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerOrganization: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    customerPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerZipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    deliveredDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    deliveryCost: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    deliveryMethod: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    items: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    printedOutDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    readDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    recycledDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    totalAmount: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    underscored: true,
    timestamps: true,
});
const isNewOrder = (obj) => {
    return ((0, type_functions_1.isObject)(obj) &&
        'currency' in obj &&
        (0, type_functions_1.isString)(obj.currency) &&
        'customerAddress' in obj &&
        (0, type_functions_1.isString)(obj.customerAddress) &&
        'customerCity' in obj &&
        (0, type_functions_1.isString)(obj.customerCity) &&
        'customerCountry' in obj &&
        (0, type_functions_1.isString)(obj.customerCountry) &&
        'customerEmail' in obj &&
        (0, type_functions_1.isString)(obj.customerEmail) &&
        'customerFirstName' in obj &&
        (0, type_functions_1.isString)(obj.customerFirstName) &&
        'customerLastName' in obj &&
        (0, type_functions_1.isString)(obj.customerLastName) &&
        'customerPhone' in obj &&
        (0, type_functions_1.isString)(obj.customerPhone) &&
        'customerZipCode' in obj &&
        (0, type_functions_1.isString)(obj.customerZipCode) &&
        'deliveryCost' in obj &&
        (0, type_functions_1.isNumber)(obj.deliveryCost) &&
        'deliveryMethod' in obj &&
        (0, type_functions_1.isString)(obj.deliveryMethod) &&
        'items' in obj &&
        (0, type_functions_1.isString)(obj.items) &&
        'language' in obj &&
        (0, type_functions_1.isString)(obj.language) &&
        'status' in obj &&
        (0, type_functions_1.isString)(obj.status) &&
        'totalAmount' in obj &&
        (0, type_functions_1.isNumber)(obj.totalAmount));
};
exports.isNewOrder = isNewOrder;
const isOrderInstance = (obj) => {
    return (0, exports.isNewOrder)(obj) && 'id' in obj && (0, type_functions_1.isNumber)(obj.id);
};
exports.isOrderInstance = isOrderInstance;
exports.default = Order;
