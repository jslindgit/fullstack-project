import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'delivery_cost');
        await context.addColumn('orders', 'delivery_cost', {
            type: DataTypes.DECIMAL,
            allowNull: false,
        });
    },
};
