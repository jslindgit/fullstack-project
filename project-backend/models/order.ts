import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../util/db';

interface OrderAttributes {
    id: number;
    currency: 'EUR' | 'USD';
    customerAddress: string;
    customerCity: string;
    customerCountry: string;
    customerEmail: string;
    customerFirstName: string;
    customerLastName: string;
    customerOrganization?: string;
    customerPhone: string;
    customerZipCode: string;
    deliveryMethod: number;
    language: 'FI' | 'EN' | 'SE';
    paymentMethod: number;
    status: string;
    totalAmount: number;
}

export type NewOrder = Omit<OrderAttributes, 'id'>;

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {
    customerOrganization?: string;
}

export interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>, OrderAttributes {}

const Order = sequelize.define<OrderInstance>(
    'order',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerCountry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerEmail: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
            allowNull: false,
        },
        customerFirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerLastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerOrganization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        customerPhone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerZipCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deliveryMethod: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    },
    {
        underscored: true,
        timestamps: true,
    }
);

type NewOrderKeys = keyof NewOrder;

export const isNewOrder = (objToValidate: unknown): objToValidate is NewOrder => {
    if (typeof objToValidate !== 'object' || objToValidate === null) {
        return false;
    }

    const keys: NewOrderKeys[] = Object.keys(objToValidate) as NewOrderKeys[];

    for (const key of keys) {
        if (typeof (objToValidate as NewOrder)[key] === 'undefined') {
            return false;
        }
    }

    return true;
};

export default Order;
