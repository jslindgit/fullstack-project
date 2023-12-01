import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('orders', 'user_id', {
            type: DataTypes.INTEGER,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'user_id');
    },
};
