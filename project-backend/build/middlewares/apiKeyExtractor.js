"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyExtractor = void 0;
const config_1 = require("../util/config");
const apiKeyExtractor = (req, res, next) => {
    res.locals.correct_api_key = false;
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('api_key')) {
        const key = authorization.substring(8);
        res.locals.correct_api_key = key === config_1.API_KEY;
    }
    next();
};
exports.apiKeyExtractor = apiKeyExtractor;
