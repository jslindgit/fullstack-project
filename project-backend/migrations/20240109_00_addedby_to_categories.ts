import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('categories', 'added_by', {
            type: DataTypes.INTEGER,
            allowNull: true,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('categories', 'added_by');
    },
};
