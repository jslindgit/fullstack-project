import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('items', 'images', {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('items', 'images');
    },
};
