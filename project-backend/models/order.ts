import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../util/db';

interface OrderAttributes {
    id: number;
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

export default Order;
