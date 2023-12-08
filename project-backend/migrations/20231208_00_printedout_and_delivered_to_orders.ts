import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('orders', 'printed_out_date', {
            type: DataTypes.DATE,
            allowNull: true,
        });
        await context.addColumn('orders', 'delivered_date', {
            type: DataTypes.DATE,
            allowNull: true,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'printed_out_date');
        await context.removeColumn('orders', 'delivered_date');
    },
};
