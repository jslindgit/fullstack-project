import express, { RequestHandler } from 'express';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import { isNewOrder } from '../models/order';
import orderService from '../services/orderService';
import { tokenExtractor } from '../middlewares/tokenExtractor';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res) => {
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
}) as RequestHandler);

router.get('/', apiKeyExtractor, (async (_req, res) => {
    if (res.locals.correct_api_key === true) {
        const orders = await orderService.getAll();
        res.status(200).json(orders);
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}) as RequestHandler);

router.get('/:id', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key === true) {
        const order = await orderService.getById(req.params.id);
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
}) as RequestHandler);

router.post('/', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key === true) {
        if (isNewOrder(req.body)) {
            const newOrder = { ...req.body };
            if ('id' in newOrder) {
                delete newOrder.id;
            }
            if ('createdAt' in newOrder) {
                delete newOrder.createdAt;
            }
            if ('updatedAt' in newOrder) {
                delete newOrder.updatedAt;
            }

            const addedOrder = await orderService.addNew(newOrder);
            res.status(201).json(addedOrder);
        } else {
            res.status(400).json({ error: 'req.body is not a NewOrder' });
        }
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}) as RequestHandler);

router.put('/:id', apiKeyExtractor, (async (req, res) => {
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
}) as RequestHandler);

router.use(errorHandler);

export default router;
