import { QueryInterface } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('settings', 'store_description');
    },
};
