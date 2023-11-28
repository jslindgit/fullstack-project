import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../util/db';
import { isBoolean, isObject, isString } from '../types/type_functions';
import { MIN_PASSWORD_LENGTH } from '../util/config';

export interface UserAttributes {
    id: number;
    admin: boolean;
    contactAddress: string;
    contactCity: string;
    contactCountry: string;
    contactFirstName: string;
    contactLastName: string;
    contactOrganization?: string;
    contactPhone: string;
    contactZipcode: string;
    disabled: boolean;
    passwordHash: string;
    token?: string;
    username: string;
}

export type NewUser = Omit<Omit<Omit<UserAttributes, 'id'>, 'token'>, 'passwordHash'> & { password: string };

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
    contactOrganization?: string;
    token?: string;
}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        contactAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactCountry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactFirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactLastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactOrganization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contactPhone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactZipcode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        username: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
            unique: true,
            allowNull: false,
        },
    },
    {
        underscored: true,
        timestamps: true,
    }
);

export const isNewUser = (obj: unknown): obj is NewUser => {
    if (obj === null || !isObject(obj)) {
        return false;
    } else {
        return (
            'admin' in obj &&
            isBoolean(obj.admin) &&
            'contactAddress' in obj &&
            isString(obj.contactAddress) &&
            'contactCity' in obj &&
            isString(obj.contactCity) &&
            'contactCountry' in obj &&
            isString(obj.contactCountry) &&
            'contactFirstName' in obj &&
            isString(obj.contactFirstName) &&
            'contactLastName' in obj &&
            isString(obj.contactLastName) &&
            'contactPhone' in obj &&
            isString(obj.contactPhone) &&
            'contactZipcode' in obj &&
            isString(obj.contactZipcode) &&
            'disabled' in obj &&
            isBoolean(obj.disabled) &&
            'password' in obj &&
            isString(obj.password) &&
            obj.password.length >= MIN_PASSWORD_LENGTH &&
            'username' in obj &&
            isString(obj.username)
        );
    }
};

export default User;
