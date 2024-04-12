import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async ({ context }: { context: QueryInterface }) => {
        await context.changeColumn('items', 'name', {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        });
    },
};

// For some reason the .changeColumn command has no effect in migration files.
// Executing ALTER TABLE items DROP CONSTRAINT items_name_key; with PSQL Tool works.
