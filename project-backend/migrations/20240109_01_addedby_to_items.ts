import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('items', 'added_by', {
            type: DataTypes.INTEGER,
            allowNull: true,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('items', 'added_by');
    },
};
