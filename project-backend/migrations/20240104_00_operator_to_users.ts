import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('users', 'operator', {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('users', 'operator');
    },
};
