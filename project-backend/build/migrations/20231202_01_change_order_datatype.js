"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.removeColumn('orders', 'delivery_method');
        await context.addColumn('orders', 'delivery_method', {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        });
    },
};
