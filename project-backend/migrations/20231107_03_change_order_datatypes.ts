import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.changeColumn('orders', 'items', {
            type: DataTypes.STRING,
            allowNull: false,
        });
    },
};
