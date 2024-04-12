import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.changeColumn('items', 'name', {
            type: DataTypes.STRING,
            allowNull: false,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.changeColumn('items', 'name', {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        });
    },
};
