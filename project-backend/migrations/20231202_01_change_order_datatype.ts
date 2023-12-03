import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('orders', 'delivery_method');
        await context.addColumn('orders', 'delivery_method', {
            type: DataTypes.TEXT,
            allowNull: false,
        });
    },
};
