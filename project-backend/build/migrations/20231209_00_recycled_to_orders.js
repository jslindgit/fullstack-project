"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('orders', 'recycled_date', {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        });
    },
    down: async ({ context }) => {
        await context.removeColumn('orders', 'recycled_date');
    },
};
