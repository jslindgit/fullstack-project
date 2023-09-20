import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                },
                unique: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            disabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            token: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.dropTable('users');
    },
};
