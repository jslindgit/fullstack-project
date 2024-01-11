import express from 'express';
import { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import { isObject, isString, toCredentials } from '../types/type_functions';
import loginService, { ChangePasswordResult, LoginError, LogoutResult } from '../services/loginService';
import service from '../services/loginService';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/', tokenExtractor, (async (_req, res, next) => {
    try {
        if (!res.locals.token || !isString(res.locals.token)) {
            res.status(401).json({ error: 'Token missing' });
        } else {
            const response: LogoutResult = await service.logout(res.locals.token);

            switch (response) {
                case LogoutResult.InvalidToken:
                    res.status(401).json({ error: 'Invalid token' });
                    console.log('invalid token');
                    break;
                case LogoutResult.SomethingWentWrong:
                    res.status(400).json({ error: 'Something went wrong' });
                    break;
                case LogoutResult.TokenMismatch:
                    res.status(400).json({ error: 'Token mismatch' });
                    break;
                case LogoutResult.UserMatchingTokenNotFound:
                    res.status(404).json({ error: 'User matching token not found' });
                    break;
                case LogoutResult.Success:
                    res.status(200).end();
            }
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
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

            res.status(200).send({ response });
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/checkpassword', apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
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

            res.status(200).send({ response });
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/changepassword', apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const credentials = toCredentials(req.body);
            if (isObject(req.body) && 'newPassword' in req.body && isString(req.body.newPassword)) {
                const result: ChangePasswordResult = await loginService.changePassword(credentials, req.body.newPassword);

                switch (result) {
                    case ChangePasswordResult.InvalidCurrentPassword:
                        res.status(401).send({ error: 'Invalid password' });
                        break;
                    case ChangePasswordResult.InvalidUserName:
                        res.status(401).send({ error: 'Invalid username' });
                        break;
                    case ChangePasswordResult.InvalidNewPassword:
                        res.status(400).send({ error: 'Invalid new password' });
                        break;
                    case ChangePasswordResult.SomethingWentWrong:
                        res.status(400).send({ error: 'Something went wrong' });
                        break;
                    case ChangePasswordResult.Success:
                        res.status(200).end();
                        break;
                }
            } else {
                res.status(400).json({ error: 'Credentials or new password missing.' });
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
