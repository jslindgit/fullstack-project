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
            customer_address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customer_city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customer_country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customer_email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                },
                allowNull: false,
            },
            customer_first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customer_last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customer_organization: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            customer_phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customer_zip_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            delivery_method: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payment_method: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_amount: {
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
