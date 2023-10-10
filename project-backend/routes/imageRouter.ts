/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';

import { isString, toNewImage } from '../types/type_functions';

import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/token_extractor';
import service from '../services/imageService';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedImage = await service.deleteById(req.params.id);
            if (deletedImage) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `Image with id ${req.params.id} not found`,
                });
            }
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/', (async (req, res, next) => {
    try {
        const images = await service.getAll(isString(req.query.search) ? req.query.search : '');
        res.json(images);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const image = await service.getById(req.params.id);
        if (image) {
            res.json(image);
        } else {
            res.status(404).json({
                error: `Image with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const newImage = toNewImage(req.body);
            const addedImage = await service.addNew(newImage);

            res.status(201).json(addedImage);
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
            const image = await service.update(req.params.id, req.body);
            if (image) {
                res.status(201).json(image);
                return;
            } else {
                res.status(404).json({
                    error: `Image with id ${req.params.id} not found`,
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
