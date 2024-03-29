import express, { RequestHandler } from 'express';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import { isNewOrder } from '../models/order';
import orderService from '../services/orderService';
import { tokenExtractor } from '../middlewares/tokenExtractor';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true || res.locals.operator === true) {
            const deletedOrder = await orderService.deleteById(req.params.id);
            if (deletedOrder) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `Order with id ${req.params.id} not found`,
                });
            }
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/', apiKeyExtractor, (async (_req, res, next) => {
    if (res.locals.correct_api_key === true) {
        try {
            const orders = await orderService.getAll();
            res.status(200).json(orders);
        } catch (err) {
            next(err);
        }
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}) as RequestHandler);

router.get('/:id', apiKeyExtractor, (async (req, res, next) => {
    if (res.locals.correct_api_key === true) {
        try {
            const order = await orderService.getById(req.params.id);
            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({
                    error: `Order with id ${req.params.id} not found`,
                });
            }
        } catch (err) {
            next(err);
        }
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}) as RequestHandler);

router.post('/', apiKeyExtractor, (async (req, res, next) => {
    if (res.locals.correct_api_key === true) {
        try {
            if (isNewOrder(req.body)) {
                const addedOrder = await orderService.addNew(req.body);
                res.status(201).json(addedOrder);
            } else {
                res.status(400).json({ error: 'req.body is not a NewOrder' });
            }
        } catch (err) {
            next(err);
        }
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}) as RequestHandler);

router.put('/:id', apiKeyExtractor, (async (req, res, next) => {
    if (res.locals.correct_api_key === true) {
        try {
            const order = await orderService.update(req.params.id, req.body);
            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({
                    error: `Order with id ${req.params.id} not found`,
                });
            }
        } catch (err) {
            next(err);
        }
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
