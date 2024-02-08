"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const apiKeyExtractor_1 = require("../middlewares/apiKeyExtractor");
const errors_1 = require("../middlewares/errors");
const order_1 = require("../models/order");
const orderService_1 = __importDefault(require("../services/orderService"));
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const router = express_1.default.Router();
router.delete('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedOrder = await orderService_1.default.deleteById(req.params.id);
            if (deletedOrder) {
                res.status(204).end();
            }
            else {
                res.status(404).json({
                    error: `Order with id ${req.params.id} not found`,
                });
            }
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.get('/', (async (_req, res, next) => {
    try {
        const orders = await orderService_1.default.getAll();
        res.status(200).json(orders);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const order = await orderService_1.default.getById(req.params.id);
        if (order) {
            res.status(200).json(order);
        }
        else {
            res.status(404).json({
                error: `Order with id ${req.params.id} not found`,
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
            if ((0, order_1.isNewOrder)(req.body)) {
                const addedOrder = await orderService_1.default.addNew(req.body);
                res.status(201).json(addedOrder);
            }
            else {
                res.status(400).json({ error: 'req.body is not a NewOrder' });
            }
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.put('/:id', apiKeyExtractor_1.apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const order = await orderService_1.default.update(req.params.id, req.body);
            if (order) {
                res.status(200).json(order);
            }
            else {
                res.status(404).json({
                    error: `Order with id ${req.params.id} not found`,
                });
            }
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.use(errors_1.errorHandler);
exports.default = router;
