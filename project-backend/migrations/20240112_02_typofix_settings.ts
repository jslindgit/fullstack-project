import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('settings', 'store_contact_city', {
            type: DataTypes.STRING,
            defaultValue: '',
        });
        await context.removeColumn('settings', 'store_contact_ity');
    },
};
