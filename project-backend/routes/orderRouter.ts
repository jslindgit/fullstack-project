/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import orderService from '../services/orderService';
import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { tokenExtractor } from '../middlewares/tokenExtractor';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
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

router.get('/', (async (_req, res, next) => {
    try {
        const orders = await orderService.getAll();
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', tokenExtractor, (async (req, res, next) => {
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
}) as RequestHandler);

router.put('/:id', apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const order = await orderService.update(req.params.id, req.body);
            if (order) {
                res.status(200).json(order);
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

router.use(errorHandler);

export default router;