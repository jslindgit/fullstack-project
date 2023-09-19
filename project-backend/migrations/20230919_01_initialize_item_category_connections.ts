import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.createTable('item_category_connections', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            item_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'items', key: 'id' },
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'categories', key: 'id' },
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
        await context.dropTable('item_category_connections');
    },
};
