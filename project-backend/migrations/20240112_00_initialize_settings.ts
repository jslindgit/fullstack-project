import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.createTable('settings', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            owner_business_dentifier: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            owner_email: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            owner_name: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            owner_phone: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_ity: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_country: {
                type: DataTypes.TEXT,
                defaultValue: '',
            },
            store_contact_email: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_phone: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            store_contact_zipcode: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            store_delivery_countries: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: true,
            },
            store_delivery_time_business_days: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            store_description: {
                type: DataTypes.TEXT,
                defaultValue: '',
            },
            store_name: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            store_welcome: {
                type: DataTypes.TEXT,
                defaultValue: '',
            },
            vat: {
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
        await context.dropTable('settings');
    },
};
