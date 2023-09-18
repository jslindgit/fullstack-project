import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import itemService from '../services/item_service';
import { isString, toNewItem } from '../types/type_functions';

const router = express.Router();

router.delete('/:id', (async (req, res, next) => {
    try {
        const deletedItem = await itemService.deleteItemById(req.params.id);
        if (deletedItem) {
            res.status(204).end();
        } else {
            res.status(404).json({
                error: `Item with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/', (async (req, res, next) => {
    try {
        const items = await itemService.getItems(
            isString(req.query.search) ? req.query.search : ''
        );
        res.json(items);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const item = await itemService.getItemById(req.params.id);
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

router.post('/', (async (req, res, next) => {
    try {
        const newItem = toNewItem(req.body);
        const addedItem = await itemService.addItem(newItem);

        res.status(201).json(addedItem);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.put('/:id', (async (req, res, next) => {
    try {
        const item = await itemService.updateItem(req.params.id, req.body);
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

router.use(errorHandler);

export default router;
