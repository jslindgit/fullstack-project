"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('users', 'contact_address', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_city', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_country', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_first_name', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_last_name', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_organization', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        });
        await context.addColumn('users', 'contact_phone', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_zipcode', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
    },
};
