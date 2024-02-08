"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewUser = exports.removePasswordHash = exports.isNewUser = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../util/db");
const type_functions_1 = require("../types/type_functions");
const userProvider_1 = require("../util/userProvider");
const User = db_1.sequelize.define('user', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    admin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    contactAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactCity: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactCountry: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactFirstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactLastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactOrganization: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    contactPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactZipcode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    disabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    operator: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '',
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            isEmail: true,
        },
        unique: true,
        allowNull: false,
    },
}, {
    underscored: true,
    timestamps: true,
});
const isNewUser = (obj) => {
    if (obj === null || !(0, type_functions_1.isObject)(obj)) {
        return false;
    }
    else {
        return ('admin' in obj &&
            (0, type_functions_1.isBoolean)(obj.admin) &&
            'contactAddress' in obj &&
            (0, type_functions_1.isString)(obj.contactAddress) &&
            'contactCity' in obj &&
            (0, type_functions_1.isString)(obj.contactCity) &&
            'contactCountry' in obj &&
            (0, type_functions_1.isString)(obj.contactCountry) &&
            'contactFirstName' in obj &&
            (0, type_functions_1.isString)(obj.contactFirstName) &&
            'contactLastName' in obj &&
            (0, type_functions_1.isString)(obj.contactLastName) &&
            'contactPhone' in obj &&
            (0, type_functions_1.isString)(obj.contactPhone) &&
            'contactZipcode' in obj &&
            (0, type_functions_1.isString)(obj.contactZipcode) &&
            'disabled' in obj &&
            (0, type_functions_1.isBoolean)(obj.disabled) &&
            'operator' in obj &&
            (0, type_functions_1.isBoolean)(obj.operator) &&
            'password' in obj &&
            (0, type_functions_1.isString)(obj.password) &&
            (0, userProvider_1.isValidPassword)(obj.password) &&
            'username' in obj &&
            (0, type_functions_1.isString)(obj.username));
    }
};
exports.isNewUser = isNewUser;
const removePasswordHash = (user) => {
    if (user) {
        const userAttributes = { ...user.toJSON() };
        delete userAttributes.passwordHash;
        return userAttributes;
    }
    return null;
};
exports.removePasswordHash = removePasswordHash;
const toNewUser = (object) => {
    if (!(0, exports.isNewUser)(object)) {
        throw new Error('Incorrect or missing data for toNewUser');
    }
    else {
        return object;
    }
};
exports.toNewUser = toNewUser;
exports.default = User;
