"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.createTable('items', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL,
                allowNull: false,
            },
            instock: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
            },
        });
    },
    down: async ({ context }) => {
        await context.dropTable('items');
    },
};
