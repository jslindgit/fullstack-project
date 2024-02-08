"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.createTable('image_items', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            image_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'images', key: 'id' },
            },
            item_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'items', key: 'id' },
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
        await context.dropTable('image_items');
    },
};
