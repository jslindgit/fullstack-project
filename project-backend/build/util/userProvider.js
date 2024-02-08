"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = void 0;
const isValidPassword = (password) => {
    return password.length >= 10;
};
exports.isValidPassword = isValidPassword;
