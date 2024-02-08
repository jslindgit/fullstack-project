"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.changeColumn('orders', 'delivery_method', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
        await context.changeColumn('orders', 'payment_method', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        });
    },
};
