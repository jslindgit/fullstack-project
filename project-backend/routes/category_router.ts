import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import service from '../services/category_service';
import { isString, toNewCategory } from '../types/type_functions';

const router = express.Router();

router.delete('/:id', (async (req, res, next) => {
    try {
        const deletedCategory = await service.deleteById(req.params.id);
        if (deletedCategory) {
            res.status(204).end();
        } else {
            res.status(404).json({
                error: `Category with id ${req.params.id} not found`,
            });
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

router.post('/', (async (req, res, next) => {
    try {
        const newCategory = toNewCategory(req.body);
        const addedCategory = await service.addNew(newCategory);

        res.status(201).json(addedCategory);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.put('/:id', (async (req, res, next) => {
    try {
        const item = await service.update(req.params.id, req.body);
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
