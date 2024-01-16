import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('settings', 'store_contact_street_address', {
            type: DataTypes.STRING,
            defaultValue: '',
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('settings', 'store_contact_street_address');
    },
};
