"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('items', 'fits_in_letter', {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        });
    },
    down: async ({ context }) => {
        await context.removeColumn('items', 'fits_in_letter');
    },
};