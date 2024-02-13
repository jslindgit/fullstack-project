"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('orders', 'user_id', {
            type: sequelize_1.DataTypes.INTEGER,
        });
    },
    down: async ({ context }) => {
        await context.removeColumn('orders', 'user_id');
    },
};
