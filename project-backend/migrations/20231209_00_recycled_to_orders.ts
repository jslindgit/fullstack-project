import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('orders', 'recycled_date', {
            type: DataTypes.DATE,
            allowNull: true,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'recycled_date');
    },
};
