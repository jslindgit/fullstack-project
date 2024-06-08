import express from 'express';
import { RequestHandler } from 'express';

import { isNumber, isObject, isString, toNewItem } from '../types/type_functions';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import service from '../services/itemService';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res) => {
    const item = await service.getById(req.params.id);

    if (!item) {
        res.status(404).end();
    } else {
        if (res.locals.admin === true || (res.locals.operator === true && item.addedBy && item.addedBy === res.locals.user_id)) {
            const deletedItem = await service.deleteById(req.params.id);
            if (deletedItem) {
                res.json({ success: true });
            } else {
                res.status(500).end();
            }
        } else {
            res.status(403).end();
        }
    }
}) as RequestHandler);

router.get('/', apiKeyExtractor, (async (_req, res) => {
    if (res.locals.correct_api_key) {
        const items = await service.getAll();
        res.json(items);
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.get('/:id', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        const item = await service.getById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({
                error: `Item with id ${req.params.id} not found`,
            });
        }
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res) => {
    if ((res.locals.admin === true || res.locals.operator === true) && res.locals.user_id && isNumber(res.locals.user_id)) {
        const newItem = toNewItem(req.body);

        let category_ids: number[] = [];
        if (isObject(req.body) && 'category_ids' in req.body && Array.isArray(req.body.category_ids) && req.body.category_ids.every((id) => isNumber(id))) {
            category_ids = [...(req.body.category_ids as number[])];
        }

        const addedItem = await service.addNew({ ...newItem, addedBy: res.locals.user_id }, category_ids);

        res.status(201).json(addedItem);
    } else {
        res.status(403).end();
    }
}) as RequestHandler);

router.put('/updateinstockandsold/:id', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key === true) {
        if (
            isObject(req.body) &&
            'sizes' in req.body &&
            Array.isArray(req.body.sizes) &&
            req.body.sizes.every((s) => isString(s)) &&
            'sold' in req.body &&
            isNumber(req.body.sold)
        ) {
            const updatedItem = await service.update(req.params.id, { sizes: req.body.sizes, sold: req.body.sold }, null);
            if (updatedItem) {
                res.status(200).json(updatedItem);
            } else {
                res.status(500).end();
            }
        } else {
            res.status(400).json({ error: '"instock" and "sold" properties missing or invalid.' });
        }
    } else {
        res.status(403).end();
    }
}) as RequestHandler);

router.put('/:id', tokenExtractor, (async (req, res) => {
    const item = await service.getById(req.params.id);
    if (!item) {
        res.status(404).end();
    } else {
        if (res.locals.admin === true || (res.locals.operator === true && item.addedBy && item.addedBy === res.locals.user_id)) {
            let category_ids: number[] | null = null;
            if (isObject(req.body) && 'category_ids' in req.body && Array.isArray(req.body.category_ids) && req.body.category_ids.every((id) => isNumber(id))) {
                category_ids = [...(req.body.category_ids as number[])];
            }

            const updatedItem = await service.update(req.params.id, req.body, category_ids);

            if (updatedItem) {
                res.status(200).json(updatedItem);
                return;
            } else {
                res.status(400).end();
            }
        } else {
            res.status(403).end();
        }
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
