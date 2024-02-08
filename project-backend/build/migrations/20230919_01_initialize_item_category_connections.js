"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.createTable('item_categories', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            item_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'items', key: 'id' },
            },
            category_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'categories', key: 'id' },
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
        await context.dropTable('item_categories');
    },
};
