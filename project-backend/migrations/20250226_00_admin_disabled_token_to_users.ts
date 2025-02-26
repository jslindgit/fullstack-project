import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('users', 'admin', {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        });
        await context.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        });
        await context.addColumn('users', 'token', {
            type: DataTypes.STRING,
            defaultValue: '',
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('users', 'admin');
        await context.removeColumn('users', 'disabled');
        await context.removeColumn('users', 'token');
    },
};
