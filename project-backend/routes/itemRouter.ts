import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import itemService from '../services/itemService';
import { toNewItem } from '../util/type_functions';

const router = express.Router();

router.get('/', (async (_req, res, next) => {
    try {
        const items = await itemService.getItems();
        res.json(items);
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

router.use(errorHandler);

export default router;
