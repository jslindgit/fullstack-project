"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.changeColumn('items', 'description', {
            type: sequelize_1.DataTypes.TEXT,
            defaultValue: '',
        });
    },
    down: async ({ context }) => {
        await context.changeColumn('items', 'description', {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: '',
        });
    },
};
