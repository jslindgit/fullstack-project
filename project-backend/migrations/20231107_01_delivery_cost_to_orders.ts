import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('orders', 'delivery_cost', {
            type: DataTypes.ARRAY(DataTypes.DECIMAL),
            allowNull: false,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'delivery_cost');
    },
};
