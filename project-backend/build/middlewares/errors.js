"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error('errorHandler:', err);
    if (err.message.includes('NotFoundError')) {
        return res.status(404).json({ error: err.message });
    }
    return res.status(400).json({ error: err.message });
};
exports.errorHandler = errorHandler;
