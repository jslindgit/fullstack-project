import express, { RequestHandler } from 'express';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import { isNumber, isString } from '../types/type_functions';
import { toNewUser } from '../models/user';
import { isValidPassword } from '../util/userProvider';
import service from '../services/userService';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res) => {
    const user = await service.getById(req.params.id, false);

    if (!user) {
        res.status(404).end();
    } else {
        if (res.locals.admin === true || res.locals.user_id === user.id) {
            const deletedUser = await service.deleteById(req.params.id);
            if (deletedUser) {
                res.json({ success: true });
            } else {
                res.status(404).end();
            }
        } else {
            res.status(403).end();
        }
    }
}) as RequestHandler);

router.get('/', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        const users = await service.getAll(isString(req.query.search) ? req.query.search : '');
        res.json(users);
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.get('/me', tokenExtractor, (async (req, res) => {
    if (res.locals.user_id && isNumber(res.locals.user_id)) {
        const user = await service.getById(res.locals.user_id, true);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                error: `User with id ${req.params.id} not found`,
            });
        }
    }
}) as RequestHandler);

router.get('/username/:username', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        const isAvailable = await service.getUsernameIsAvailable(req.params.username);
        res.status(200).json({ isAvailable: isAvailable });
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.get('/:id', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        const user = await service.getById(req.params.id, false);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                error: `User with id ${req.params.id} not found`,
            });
        }
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.post('/', apiKeyExtractor, (async (req, res) => {
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
}) as RequestHandler);

router.put('/:id', tokenExtractor, (async (req, res) => {
    const userToUpdate = await service.getById(req.params.id, false);

    if (!userToUpdate) {
        res.status(404).end();
    } else {
        if (
            (userToUpdate.admin === false || res.locals.admin === true) &&
            (res.locals.admin === true || (res.locals.operator === true && userToUpdate.operator === false) || res.locals.user_id === userToUpdate.id)
        ) {
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
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
