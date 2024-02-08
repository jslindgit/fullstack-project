"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.createTable('orders', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            currency: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customer_address: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customer_city: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customer_country: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customer_email: {
                type: sequelize_1.DataTypes.STRING,
                validate: {
                    isEmail: true,
                },
                allowNull: false,
            },
            customer_first_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customer_last_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customer_organization: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            customer_phone: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customer_zip_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            delivery_method: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            language: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            payment_method: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            total_amount: {
                type: sequelize_1.DataTypes.DECIMAL,
                allowNull: false,
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
        await context.dropTable('orders');
    },
};
