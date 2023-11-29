/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import { isNumber, isString } from '../types/type_functions';
import { toNewUser } from '../models/user';
import { isValidPassword } from '../util/userProvider';
import service from '../services/userService';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedUser = await service.deleteById(req.params.id);
            if (deletedUser) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `User with id ${req.params.id} not found`,
                });
            }
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/', apiKeyExtractor, (async (req, res, next) => {
    try {
        const users = await service.getAll(isString(req.query.search) ? req.query.search : '');
        res.json(users);
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/me', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.user_id && isNumber(res.locals.user_id)) {
            const user = await service.getById(res.locals.user_id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({
                    error: `User with id ${req.params.id} not found`,
                });
            }
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        const user = await service.getById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                error: `User with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const newUser = toNewUser(req.body);

            if (!isValidPassword(newUser.password)) {
                res.status(400).json({ error: 'Password too short' });
            }

            const addedUser = await service.addNew(newUser);

            res.status(201).json(addedUser);
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
            const user = await service.update(req.params.id, req.body);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    error: `User with id ${req.params.id} not found`,
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
