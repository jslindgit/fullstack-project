import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.createTable('image_items', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            image_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'images', key: 'id' },
            },
            item_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'items', key: 'id' },
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
        await context.dropTable('image_items');
    },
};
