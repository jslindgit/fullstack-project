import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('settings', 'owner_business_identifier', {
            type: DataTypes.STRING,
            defaultValue: '',
        });
        await context.removeColumn('settings', 'owner_business_dentifier');
    },
};
