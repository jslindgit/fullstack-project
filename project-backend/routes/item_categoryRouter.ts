/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import service from '../services/item_category_service';
import { toNewItem_Category } from '../types/type_functions';
import { tokenExtractor } from '../middlewares/token_extractor';

const router = express.Router();

router.delete('/all_by_item_id/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const all = await service.getAll();
            if (all) {
                console.log('all.length:', all.length);
                const matching = all.filter((ic) => 'itemId' in ic && ic.itemId === Number(req.params.id));
                console.log('matching.length:', matching.length);
                matching.forEach(async (toDel) => {
                    if ('id' in toDel) {
                        console.log('deleting item_category with id ' + toDel.id + '...');
                        await service.deleteById(toDel.id);
                    }
                });
            }
            res.status(204).end();
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedItem = await service.deleteById(req.params.id);
            if (deletedItem) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `Item_Category with id ${req.params.id} not found`,
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
        const item_categories = await service.getAll();
        res.json(item_categories);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const item_category = await service.getById(req.params.id);
        if (item_category) {
            res.json(item_category);
        } else {
            res.status(404).json({
                error: `Item_Category with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const newItem_Category = toNewItem_Category(req.body);
            const addedItem_Category = await service.addNew(newItem_Category);

            res.status(201).json(addedItem_Category);
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
