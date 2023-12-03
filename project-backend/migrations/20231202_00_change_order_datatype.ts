import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'items');
        await context.addColumn('orders', 'items', {
            type: DataTypes.TEXT,
            allowNull: false,
        });
    },
};
