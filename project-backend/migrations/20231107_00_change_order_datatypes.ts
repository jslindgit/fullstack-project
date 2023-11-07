import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.changeColumn('orders', 'delivery_method', {
            type: DataTypes.STRING,
            allowNull: false,
        });
        await context.changeColumn('orders', 'payment_method', {
            type: DataTypes.STRING,
            allowNull: true,
        });
    },
};
