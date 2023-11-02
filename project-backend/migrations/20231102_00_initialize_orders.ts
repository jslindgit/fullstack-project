import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.createTable('orders', {
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
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.dropTable('orders');
    },
};
