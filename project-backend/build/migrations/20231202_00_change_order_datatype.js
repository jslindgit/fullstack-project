"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.removeColumn('orders', 'items');
        await context.addColumn('orders', 'items', {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        });
    },
};
