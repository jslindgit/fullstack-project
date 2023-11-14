import { Model, DataTypes, Optional } from 'sequelize';

import { isNumber, isString } from '../types/type_functions';
import { sequelize } from '../util/db';

export interface OrderAttributes {
    id: number;
    currency: string;
    customerAddress: string;
    customerCity: string;
    customerCountry: string;
    customerEmail: string;
    customerFirstName: string;
    customerLastName: string;
    customerOrganization?: string;
    customerPhone: string;
    customerZipCode: string;
    deliveryCost: number;
    deliveryMethod: string;
    items: string;
    language: string;
    paymentMethod?: string;
    status: string;
    statusForAdmin: string;
    totalAmount: number;
}

export type NewOrder = Omit<Omit<OrderAttributes, 'id'>, 'paymentMethod'>;

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {
    customerOrganization?: string;
    paymentMethod?: string;
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
        deliveryCost: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        deliveryMethod: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        items: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        statusForAdmin: {
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

export const isNewOrder = (obj: unknown): obj is NewOrder => {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    if (
        'currency' in obj &&
        isString(obj.currency) &&
        'customerAddress' in obj &&
        isString(obj.customerAddress) &&
        'customerCity' in obj &&
        isString(obj.customerCity) &&
        'customerCountry' in obj &&
        isString(obj.customerCountry) &&
        'customerEmail' in obj &&
        isString(obj.customerEmail) &&
        'customerFirstName' in obj &&
        isString(obj.customerFirstName) &&
        'customerLastName' in obj &&
        isString(obj.customerLastName) &&
        'customerPhone' in obj &&
        isString(obj.customerPhone) &&
        'customerZipCode' in obj &&
        isString(obj.customerZipCode) &&
        'deliveryCost' in obj &&
        isNumber(obj.deliveryCost) &&
        'deliveryMethod' in obj &&
        isString(obj.deliveryMethod) &&
        'items' in obj &&
        isString(obj.items) &&
        'language' in obj &&
        isString(obj.language) &&
        'status' in obj &&
        isString(obj.status) &&
        'statusForAdmin' in obj &&
        isString(obj.statusForAdmin) &&
        'totalAmount' in obj &&
        isNumber(obj.totalAmount)
    ) {
        return true;
    }

    return false;
};

export default Order;
