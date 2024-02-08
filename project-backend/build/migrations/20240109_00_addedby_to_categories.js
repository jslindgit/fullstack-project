"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('categories', 'added_by', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        });
    },
    down: async ({ context }) => {
        await context.removeColumn('categories', 'added_by');
    },
};
