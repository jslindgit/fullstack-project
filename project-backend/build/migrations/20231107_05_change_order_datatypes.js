"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.removeColumn('orders', 'delivery_cost');
        await context.addColumn('orders', 'delivery_cost', {
            type: sequelize_1.DataTypes.DECIMAL,
            allowNull: false,
        });
    },
};
