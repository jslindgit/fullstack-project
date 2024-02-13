"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.createTable('settings', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            owner_business_dentifier: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            owner_email: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            owner_name: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            owner_phone: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_ity: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_country: {
                type: sequelize_1.DataTypes.TEXT,
                defaultValue: '',
            },
            store_contact_email: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_phone: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_zipcode: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            store_delivery_countries: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
                allowNull: true,
            },
            store_delivery_time_business_days: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
            },
            store_description: {
                type: sequelize_1.DataTypes.TEXT,
                defaultValue: '',
            },
            store_name: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: '',
            },
            store_welcome: {
                type: sequelize_1.DataTypes.TEXT,
                defaultValue: '',
            },
            vat: {
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
        await context.dropTable('settings');
    },
};
