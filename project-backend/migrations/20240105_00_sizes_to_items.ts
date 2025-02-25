import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('items', 'sizes', {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('items', 'sizes');
    },
};
