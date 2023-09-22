import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import { isObject, isString, toCredentials } from '../types/type_functions';
import { LoginError, LogoutResult } from '../services/login_service';
import service from '../services/login_service';
import { User } from '../models';

const router = express.Router();

router.delete('/:id', (async (req, res, next) => {
    try {
        const authorization = req.get('authorization');
        if (!isString(authorization)) {
            res.status(401).json({ error: 'Token missing' });
            return;
        }
        const token = authorization.substring(7);
        const response: LogoutResult = await service.logout(token);

        // prettier-ignore
        switch (response) {
        case LogoutResult.InvalidToken:
            res.status(401).json({ error: 'Invalid token'});
            return;
        case LogoutResult.SomethingWentWrong:
            res.status(400).json({ error: 'Something went wrong' });
            return;
        case LogoutResult.TokenMismatch:
            res.status(400).json({ error: 'Token mismatch' });
            return;
        case LogoutResult.UserMatchingTokenNotFound:
            res.status(404).json({ error: 'User matching token not found' });
            return;
        case LogoutResult.Success:
            res.status(200).end();
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', (async (req, res, next) => {
    try {
        const credentials = toCredentials(req.body);
        const response = await service.login(credentials);

        // prettier-ignore
        switch (response) {
        case LoginError.InvalidPassword:
            res.status(401).json({ error: 'Invalid password' });
            return;
        case LoginError.InvalidUsername:
            res.status(401).json({ error: 'Invalid username' });
            return;
        case LoginError.SomethingWentWrong:
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }

        if (
            isObject(response) &&
            'token' in response &&
            isString(response.token) &&
            'user' in response &&
            response.user instanceof User
        ) {
            res.status(200).send({
                response,
            });
            return;
        }

        res.status(400).json({ error: 'Something went wrong' });
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
