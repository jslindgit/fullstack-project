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
            customerAddress: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customerCity: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customerCountry: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customerEmail: {
                type: sequelize_1.DataTypes.STRING,
                validate: {
                    isEmail: true,
                },
                allowNull: false,
            },
            customerFirstName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customerLastName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customerOrganization: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            customerPhone: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            customerZipCode: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            deliveryMethod: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            language: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            paymentMethod: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            totalAmount: {
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
