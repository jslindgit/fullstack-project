import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.createTable('images', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            data: {
                type: DataTypes.BLOB('long'),
                allowNull: false,
            },
            filename: {
                type: DataTypes.STRING,
                allowNull: false,
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
        await context.dropTable('images');
    },
};
