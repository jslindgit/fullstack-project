"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('users', 'operator', {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        });
    },
    down: async ({ context }) => {
        await context.removeColumn('users', 'operator');
    },
};
