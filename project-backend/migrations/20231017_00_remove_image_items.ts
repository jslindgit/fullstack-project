import { QueryInterface } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.dropTable('image_items');
    },
};
