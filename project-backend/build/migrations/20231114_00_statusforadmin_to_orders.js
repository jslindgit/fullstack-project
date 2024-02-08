"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('orders', 'status_for_admin', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
    },
    down: async ({ context }) => {
        await context.removeColumn('orders', 'status_for_admin');
    },
};
