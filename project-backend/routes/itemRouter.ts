/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';

import { isNumber, isObject, toNewItem } from '../types/type_functions';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import service from '../services/itemService';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        const item = await service.getById(req.params.id);
        if (!item) {
            res.status(404).end();
        } else {
            if (res.locals.admin === true || (res.locals.operator === true && item.addedBy && item.addedBy === res.locals.user_id)) {
                const deletedItem = await service.deleteById(req.params.id);
                if (deletedItem) {
                    res.status(204).end();
                } else {
                    res.status(404).json({
                        error: `Item with id ${req.params.id} not found`,
                    });
                }
            } else {
                res.status(403).end();
            }
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/', (async (_req, res, next) => {
    try {
        const items = await service.getAll();
        res.json(items);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const item = await service.getById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({
                error: `Item with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res, next) => {
    try {
        if ((res.locals.admin === true || res.locals.operator === true) && res.locals.user_id && isNumber(res.locals.user_id)) {
            const newItem = toNewItem(req.body);
            let category_id = null;
            if (isObject(req.body) && 'category_id' in req.body && isNumber(req.body.category_id)) {
                category_id = req.body.category_id;
            }
            const addedItem = await service.addNew({ ...newItem, addedBy: res.locals.user_id }, category_id);

            res.status(201).json(addedItem);
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.put('/:id', apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const item = await service.update(req.params.id, req.body);
            if (item) {
                res.status(200).json(item);
                return;
            } else {
                res.status(404).json({
                    error: `Item with id ${req.params.id} not found`,
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
