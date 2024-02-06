import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.addColumn('items', 'fits_in_letter', {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        });
    },
    down: async ({ context }: { context: QueryInterface }) => {
        await context.removeColumn('items', 'fits_in_letter');
    },
};
