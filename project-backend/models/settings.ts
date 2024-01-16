import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../util/db';
import { isNumber, isObject, isString } from '../types/type_functions';

export interface SettingsAttributes {
    id: number;
    ownerBusinessIdentifier: string;
    ownerEmail: string;
    ownerName: string;
    ownerPhone: string;
    storeContactCity: string;
    storeContactCountry: string;
    storeContactEmail: string;
    storeContactPhone: string;
    storeContactStreetAddress: string;
    storeContactZipcode: string;
    storeDeliveryCountries: string[];
    storeDeliveryTimeBusinessDays: number;
    storeDescription: string;
    storeName: string;
    storeWelcome: string;
    vat: number;
}

export type NewSettings = Omit<SettingsAttributes, 'id'>;

interface SettingsCreationAttributes extends Optional<SettingsAttributes, 'id'> {}

export interface SettingsInstance extends Model<SettingsAttributes, SettingsCreationAttributes>, SettingsAttributes {}

const Settings = sequelize.define<SettingsInstance>(
    'settings',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ownerBusinessIdentifier: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        ownerEmail: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        ownerName: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        ownerPhone: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        storeContactCity: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        storeContactCountry: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
        storeContactEmail: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        storeContactPhone: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        storeContactStreetAddress: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        storeContactZipcode: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        storeDeliveryCountries: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true,
        },
        storeDeliveryTimeBusinessDays: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        storeDescription: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
        storeName: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        storeWelcome: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
        vat: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    },
    {
        underscored: true,
        timestamps: true,
    }
);

export const isNewSettings = (obj: unknown): obj is NewSettings => {
    if (!obj || obj === null || !isObject(obj)) {
        return false;
    } else {
        return (
            'ownerBusinessIdentifier' in obj &&
            isString(obj.ownerBusinessIdentifier) &&
            'ownerEmail' in obj &&
            isString(obj.ownerEmail) &&
            'ownerName' in obj &&
            isString(obj.ownerName) &&
            'ownerPhone' in obj &&
            isString(obj.ownerPhone) &&
            'storeContactCity' in obj &&
            isString(obj.storeContactCity) &&
            'storeContactCountry' in obj &&
            isString(obj.storeContactCountry) &&
            'storeContactEmail' in obj &&
            isString(obj.storeContactEmail) &&
            'storeContactPhone' in obj &&
            isString(obj.storeContactPhone) &&
            'storeContactStreetAddress' in obj &&
            isString(obj.storeContactStreetAddress) &&
            'storeContactZipcode' in obj &&
            isString(obj.storeContactZipcode) &&
            'storeDeliveryCountries' in obj &&
            Array.isArray(obj.storeDeliveryCountries) &&
            obj.storeDeliveryCountries.every((s) => isString(s)) &&
            'storeDeliveryTimeBusinessDays' in obj &&
            isNumber(obj.storeDeliveryTimeBusinessDays) &&
            'storeDescription' in obj &&
            isString(obj.storeDescription) &&
            'storeName' in obj &&
            isString(obj.storeName) &&
            'storeWelcome' in obj &&
            isString(obj.storeWelcome) &&
            'vat' in obj &&
            isNumber(obj.vat)
        );
    }
};

export default Settings;
