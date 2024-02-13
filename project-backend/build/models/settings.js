"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewSettings = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../util/db");
const type_functions_1 = require("../types/type_functions");
const Settings = db_1.sequelize.define('settings', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ownerBusinessIdentifier: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    ownerEmail: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    ownerName: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    ownerPhone: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    storeContactCity: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    storeContactCountry: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: '',
    },
    storeContactEmail: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    storeContactPhone: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    storeContactStreetAddress: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    storeContactZipcode: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    storeDeliveryCountries: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
        allowNull: true,
    },
    storeDeliveryTimeBusinessDays: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    storeName: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    storeWelcome: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: '',
    },
    vat: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
}, {
    underscored: true,
    timestamps: true,
});
const isNewSettings = (obj) => {
    if (!obj || obj === null || !(0, type_functions_1.isObject)(obj)) {
        return false;
    }
    else {
        return ('ownerBusinessIdentifier' in obj &&
            (0, type_functions_1.isString)(obj.ownerBusinessIdentifier) &&
            'ownerEmail' in obj &&
            (0, type_functions_1.isString)(obj.ownerEmail) &&
            'ownerName' in obj &&
            (0, type_functions_1.isString)(obj.ownerName) &&
            'ownerPhone' in obj &&
            (0, type_functions_1.isString)(obj.ownerPhone) &&
            'storeContactCity' in obj &&
            (0, type_functions_1.isString)(obj.storeContactCity) &&
            'storeContactCountry' in obj &&
            (0, type_functions_1.isString)(obj.storeContactCountry) &&
            'storeContactEmail' in obj &&
            (0, type_functions_1.isString)(obj.storeContactEmail) &&
            'storeContactPhone' in obj &&
            (0, type_functions_1.isString)(obj.storeContactPhone) &&
            'storeContactStreetAddress' in obj &&
            (0, type_functions_1.isString)(obj.storeContactStreetAddress) &&
            'storeContactZipcode' in obj &&
            (0, type_functions_1.isString)(obj.storeContactZipcode) &&
            'storeDeliveryCountries' in obj &&
            Array.isArray(obj.storeDeliveryCountries) &&
            obj.storeDeliveryCountries.every((s) => (0, type_functions_1.isString)(s)) &&
            'storeDeliveryTimeBusinessDays' in obj &&
            (0, type_functions_1.isNumber)(obj.storeDeliveryTimeBusinessDays) &&
            'storeDescription' in obj &&
            (0, type_functions_1.isString)(obj.storeDescription) &&
            'storeName' in obj &&
            (0, type_functions_1.isString)(obj.storeName) &&
            'storeWelcome' in obj &&
            (0, type_functions_1.isString)(obj.storeWelcome) &&
            'vat' in obj &&
            (0, type_functions_1.isNumber)(obj.vat));
    }
};
exports.isNewSettings = isNewSettings;
exports.default = Settings;
