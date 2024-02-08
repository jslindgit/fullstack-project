"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExtractor = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const type_functions_1 = require("../types/type_functions");
const config_1 = require("../util/config");
const models_1 = require("../models");
const tokenExtractor = async (req, res, next) => {
    res.locals.token = undefined;
    res.locals.user_id = undefined;
    res.locals.admin = false;
    res.locals.operator = false;
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        const token = authorization.substring(7);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.SECRET);
        if ((0, type_functions_1.isObject)(decodedToken) && 'id' in decodedToken && (0, type_functions_1.isNumber)(decodedToken.id)) {
            const user = await models_1.User.findByPk(decodedToken.id);
            if (!user) {
                res.status(401).json({ error: 'User matching the token not found' });
                return;
            }
            if (user.getDataValue('disabled') === true) {
                user.setDataValue('token', '');
                await user.save();
                res.status(401).json({ error: 'Account is disabled' });
                return;
            }
            else if (user.getDataValue('token') !== token) {
                user.setDataValue('token', '');
                await user.save();
                res.status(401).json({ error: 'Token mismatch' });
                return;
            }
            else {
                res.locals.token = token;
                res.locals.user_id = decodedToken.id;
                res.locals.admin = user.getDataValue('admin') === true;
                res.locals.operator = user.getDataValue('operator') === true;
            }
        }
    }
    next();
};
exports.tokenExtractor = tokenExtractor;
