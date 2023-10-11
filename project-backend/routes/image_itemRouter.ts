/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import service from '../services/image_itemService';
import { isObject, toNewImage_Item } from '../types/type_functions';
import { tokenExtractor } from '../middlewares/token_extractor';

const router = express.Router();

router.delete('/all_by_item_id/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const all = await service.getAll();
            if (all) {
                const matching = all.filter((ic) => 'itemId' in ic && ic.itemId === Number(req.params.id));
                matching.forEach(async (toDel) => {
                    if ('id' in toDel) {
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

router.delete('/image_and_item_id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            if (isObject(req.body) && 'image_id' in req.body && 'item_id' in req.body) {
                const image_item = await service.deleteByImageAndItemId(req.body.image_id, req.body.item_id);
                if (image_item) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Matching Image_Item not found' });
                }
            } else {
                res.status(400).json({ error: 'imageId or itemId missing from req.body' });
            }
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
            const deletedImage_Item = await service.deleteById(req.params.id);
            if (deletedImage_Item) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `Image_item with id ${req.params.id} not found`,
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
        const image_items = await service.getAll();
        res.json(image_items);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/image_item_id', (async (req, res, next) => {
    try {
        if (isObject(req.body) && 'image_id' in req.body && 'item_id' in req.body) {
            const image_item = await service.getByImageAndItemId(req.body.image_id, req.body.item_id);
            if (image_item) {
                res.json(image_item);
            } else {
                res.status(404).json({ error: 'Not found' });
            }
        } else {
            res.status(400).json({ error: 'mageId or itemId missing from req.body' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const image_item = await service.getById(req.params.id);
        if (image_item) {
            res.json(image_item);
        } else {
            res.status(404).json({
                error: `Image_Item with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const newImage_Item = toNewImage_Item(req.body);
            const addedImage_Item = await service.addNew(newImage_Item);

            res.status(201).json(addedImage_Item);
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
