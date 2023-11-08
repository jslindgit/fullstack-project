/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import service from '../services/categoryService';
import { isString, toNewCategory } from '../types/type_functions';
import { tokenExtractor } from '../middlewares/tokenExtractor';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedCategory = await service.deleteById(req.params.id);
            if (deletedCategory) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `Category with id ${req.params.id} not found`,
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
        const categories = await service.getAll(isString(req.query.search) ? req.query.search : '');
        res.json(categories);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const category = await service.getById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({
                error: `Category with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const newCategory = toNewCategory(req.body);
            const addedCategory = await service.addNew(newCategory);

            res.status(201).json(addedCategory);
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
            const category = await service.update(req.params.id, req.body);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({
                    error: `Category with id ${req.params.id} not found`,
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
