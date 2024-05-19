import express from 'express';
import { RequestHandler } from 'express';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import service from '../services/categoryService';
import { isNumber, isString, toNewCategory } from '../types/type_functions';
import { tokenExtractor } from '../middlewares/tokenExtractor';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res) => {
    const category = await service.getById(req.params.id);
    if (!category) {
        res.status(404).end();
    } else {
        if (res.locals.admin === true || (res.locals.operator === true && category.addedBy && category.addedBy === res.locals.user_id)) {
            const deletedCategory = await service.deleteById(req.params.id);
            if (deletedCategory) {
                res.status(204).end();
            } else {
                res.status(500).end();
            }
        } else {
            res.status(403).end();
        }
    }
}) as RequestHandler);

router.get('/', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        const categories = await service.getAll(isString(req.query.search) ? req.query.search : '');
        res.json(categories);
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.get('/:id', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        const category = await service.getById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).end();
        }
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res) => {
    if ((res.locals.admin === true || res.locals.operator === true) && res.locals.user_id && isNumber(res.locals.user_id)) {
        const newCategory = toNewCategory(req.body);
        const addedCategory = await service.addNew({ ...newCategory, addedBy: res.locals.user_id });

        res.status(201).json(addedCategory);
    } else {
        res.status(403).end();
    }
}) as RequestHandler);

router.put('/:id', tokenExtractor, (async (req, res) => {
    const category = await service.getById(req.params.id);
    if (!category) {
        res.status(404);
    } else {
        if (res.locals.admin === true || (res.locals.operator === true && category.addedBy && category.addedBy === res.locals.user_id)) {
            const updatedCategory = await service.update(req.params.id, req.body);
            if (updatedCategory) {
                res.status(200).json(updatedCategory);
            } else {
                res.status(500).end();
            }
        } else {
            res.status(403).end();
        }
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
