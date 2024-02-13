"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async ({ context }) => {
        await context.removeColumn('users', 'name');
    },
};
