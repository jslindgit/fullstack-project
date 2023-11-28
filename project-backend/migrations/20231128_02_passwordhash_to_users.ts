import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('users', 'password_hash', {
            type: DataTypes.STRING,
            allowNull: false,
        });
    },
};
