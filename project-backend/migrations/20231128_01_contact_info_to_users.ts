import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('users', 'contact_address', {
            type: DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_city', {
            type: DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_country', {
            type: DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_first_name', {
            type: DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_last_name', {
            type: DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_organization', {
            type: DataTypes.STRING,
            allowNull: true,
        });
        await context.addColumn('users', 'contact_phone', {
            type: DataTypes.STRING,
            allowNull: false,
        });
        await context.addColumn('users', 'contact_zipcode', {
            type: DataTypes.STRING,
            allowNull: false,
        });
    },
};
