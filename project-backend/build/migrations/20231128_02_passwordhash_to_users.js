"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('users', 'password_hash', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
    },
};
