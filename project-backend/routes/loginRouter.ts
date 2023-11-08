import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import { isBoolean, isObject, isString, toCredentials } from '../types/type_functions';
import { LoginError, LogoutResult } from '../services/loginService';
import service from '../services/loginService';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/', tokenExtractor, (async (_req, res, next) => {
    try {
        if (!res.locals.token || !isString(res.locals.token)) {
            res.status(401).json({ error: 'Token missing' });
            //return;
        } else {
            const response: LogoutResult = await service.logout(res.locals.token);

            switch (response) {
                case LogoutResult.InvalidToken:
                    res.status(401).json({ error: 'Invalid token' });
                    console.log('invalid token');
                    break;
                //return;
                case LogoutResult.SomethingWentWrong:
                    res.status(400).json({ error: 'Something went wrong' });
                    break;
                //return;
                case LogoutResult.TokenMismatch:
                    res.status(400).json({ error: 'Token mismatch' });
                    break;
                //return;
                case LogoutResult.UserMatchingTokenNotFound:
                    res.status(404).json({ error: 'User matching token not found' });
                    break;
                //return;
                case LogoutResult.Success:
                    res.status(200).end();
            }
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', (async (req, res, next) => {
    try {
        const credentials = toCredentials(req.body);
        const response = await service.login(credentials);

        switch (response) {
            case LoginError.InvalidPassword:
                res.status(401).send({ error: 'Invalid password' });
                return;
            case LoginError.InvalidUsername:
                res.status(401).send({ error: 'Invalid username' });
                return;
            case LoginError.SomethingWentWrong:
                res.status(400).send({ error: 'Something went wrong' });
                return;
        }

        if (isObject(response) && 'token' in response && isString(response.token) && 'username' in response && isString(response.username) && 'admin' in response && isBoolean(response.admin)) {
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
