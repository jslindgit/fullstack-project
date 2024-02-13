"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const apiKeyExtractor_1 = require("../middlewares/apiKeyExtractor");
const errors_1 = require("../middlewares/errors");
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const type_functions_1 = require("../types/type_functions");
const user_1 = require("../models/user");
const userProvider_1 = require("../util/userProvider");
const userService_1 = __importDefault(require("../services/userService"));
const router = express_1.default.Router();
router.delete('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const user = await userService_1.default.getById(req.params.id);
        if (!user) {
            res.status(404).end();
        }
        else {
            if (res.locals.admin === true || res.locals.user_id === user.id) {
                const deletedUser = await userService_1.default.deleteById(req.params.id);
                if (deletedUser) {
                    res.status(204).end();
                }
                else {
                    res.status(404).end();
                }
            }
            else {
                res.status(403).end();
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
router.get('/', apiKeyExtractor_1.apiKeyExtractor, (async (req, res, next) => {
    try {
        const users = await userService_1.default.getAll((0, type_functions_1.isString)(req.query.search) ? req.query.search : '');
        res.json(users);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/me', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.user_id && (0, type_functions_1.isNumber)(res.locals.user_id)) {
            const user = await userService_1.default.getById(res.locals.user_id);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({
                    error: `User with id ${req.params.id} not found`,
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const user = await userService_1.default.getById(req.params.id);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({
                error: `User with id ${req.params.id} not found`,
            });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', apiKeyExtractor_1.apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const newUser = (0, user_1.toNewUser)(req.body);
            if (!(0, userProvider_1.isValidPassword)(newUser.password)) {
                res.status(400).json({ error: 'Password too short' });
            }
            const addedUser = await userService_1.default.addNew(newUser);
            res.status(201).json(addedUser);
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.put('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const user = await userService_1.default.update(req.params.id, req.body);
        if (!user) {
            res.status(404).end();
        }
        else {
            if (user.admin === false && (res.locals.admin === true || (res.locals.operator === true && user.operator === false))) {
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(404).json({
                        error: `User with id ${req.params.id} not found`,
                    });
                }
            }
            else {
                res.status(403).json({ error: 'Access denied' });
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
router.use(errors_1.errorHandler);
exports.default = router;
