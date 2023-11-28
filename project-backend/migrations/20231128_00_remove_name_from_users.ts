import { QueryInterface } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('users', 'name');
    },
};
