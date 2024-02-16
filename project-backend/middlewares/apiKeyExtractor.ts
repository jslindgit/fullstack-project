import { NextFunction, Request, Response } from 'express';

import { API_KEY } from '../util/config';

export const apiKeyExtractor = (req: Request, res: Response, next: NextFunction) => {
    res.locals.correct_api_key = false;

    const authorization = req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('api_key')) {
        const key = authorization.substring(8);

        res.locals.correct_api_key = key === API_KEY;
    }

    next();
};
