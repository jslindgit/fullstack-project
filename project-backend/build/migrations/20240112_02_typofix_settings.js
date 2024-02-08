"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context }) => {
        await context.addColumn('settings', 'store_contact_city', {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: '',
        });
        await context.removeColumn('settings', 'store_contact_ity');
    },
};
