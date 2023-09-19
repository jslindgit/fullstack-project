import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import service from '../services/item_category_service';
import { toNewItem_Category } from '../types/type_functions';

const router = express.Router();

router.delete('/:id', (async (req, res, next) => {
    try {
        const deletedItem = await service.deleteById(req.params.id);
        if (deletedItem) {
            res.status(204).end();
        } else {
            res.status(404).json({
                error: `Item_Category with id ${req.params.id} not found`,
            });
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

router.post('/', (async (req, res, next) => {
    try {
        const newItem_Category = toNewItem_Category(req.body);
        const addedItem_Category = await service.addNew(newItem_Category);

        res.status(201).json(addedItem_Category);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
