import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.changeColumn('items', 'description', {
            type: DataTypes.TEXT,
            defaultValue: '',
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.changeColumn('items', 'description', {
            type: DataTypes.STRING,
            defaultValue: '',
        });
    },
};
