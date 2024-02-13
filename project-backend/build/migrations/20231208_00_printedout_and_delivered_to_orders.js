"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('orders', 'printed_out_date', {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        });
        await context.addColumn('orders', 'delivered_date', {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        });
    },
    down: async ({ context }) => {
        await context.removeColumn('orders', 'printed_out_date');
        await context.removeColumn('orders', 'delivered_date');
    },
};
