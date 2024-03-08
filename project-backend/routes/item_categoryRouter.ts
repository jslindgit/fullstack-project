import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import service from '../services/item_categoryService';
import { isObject, toNewItem_Category } from '../types/type_functions';
import { tokenExtractor } from '../middlewares/tokenExtractor';

const router = express.Router();

router.delete('/item_and_category_id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            if (isObject(req.body) && 'item_id' in req.body && 'category_id' in req.body) {
                const item_category = await service.deleteByItemAndCategoryId(req.body.item_id, req.body.category_id);
                if (item_category) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Matching Item_Category not found' });
                }
            } else {
                res.status(400).json({ error: 'itemId or categoryId missing from req.body' });
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

router.post('/', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true || res.locals.operator === true) {
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
