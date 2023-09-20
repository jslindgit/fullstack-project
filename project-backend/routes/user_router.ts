import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import service from '../services/user_service';
import { isString, toNewUser } from '../types/type_functions';

const router = express.Router();

router.delete('/:id', (async (req, res, next) => {
    try {
        const deletedUser = await service.deleteById(req.params.id);
        if (deletedUser) {
            res.status(204).end();
        } else {
            res.status(404).json({
                error: `User with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/', (async (req, res, next) => {
    try {
        const users = await service.getAll(isString(req.query.search) ? req.query.search : '');
        res.json(users);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const user = await service.getById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                error: `User with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', (async (req, res, next) => {
    try {
        const newUser = toNewUser(req.body);
        const addedUser = await service.addNew(newUser);

        res.status(201).json(addedUser);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.put('/:id', (async (req, res, next) => {
    try {
        const user = await service.update(req.params.id, req.body);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                error: `User with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
