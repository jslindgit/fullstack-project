import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('orders', 'read_date', {
            type: DataTypes.DATE,
            allowNull: true,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'read_date');
    },
};
