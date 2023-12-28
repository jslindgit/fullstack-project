/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';

import { isNumber, isObject, isString, toNewItem } from '../types/type_functions';

import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import service from '../services/itemService';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedItem = await service.deleteById(req.params.id);
            if (deletedItem) {
                res.status(204).end();
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

router.post('/getall', (async (req, res, next) => {
    try {
        const searchQuery: string = isObject(req.body) && 'search' in req.body && isString(req.body.search) ? req.body.search : '';
        const items = await service.getAll(searchQuery ? searchQuery : '');
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
        if (res.locals.admin === true) {
            const newItem = toNewItem(req.body);
            let category_id = null;
            if (isObject(req.body) && 'category_id' in req.body && isNumber(req.body.category_id)) {
                category_id = req.body.category_id;
            }
            console.log('category_id', category_id);
            const addedItem = await service.addNew(newItem, category_id);

            res.status(201).json(addedItem);
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.put('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
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
