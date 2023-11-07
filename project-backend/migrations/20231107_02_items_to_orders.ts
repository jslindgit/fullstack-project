import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('orders', 'items', {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'items');
    },
};
