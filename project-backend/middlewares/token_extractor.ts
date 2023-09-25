import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { isNumber, isObject } from '../types/type_functions';
import { SECRET } from '../util/config';
import { User } from '../models';

export const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        const token = authorization.substring(7);
        const decodedToken = jwt.verify(token, SECRET);

        let user = undefined;
        if (isObject(decodedToken) && 'id' in decodedToken && isNumber(decodedToken.id)) {
            user = await User.findByPk(decodedToken.id);
        }
        if (!user) {
            res.status(401).json({ error: 'User matching the token not found' });
            return;
        }
        if (user.getDataValue('disabled') === true) {
            user.setDataValue('token', '');
            await user.save();
            res.status(401).json({ error: 'Account has been disabled' });
            return;
        }
        if (user.getDataValue('token') !== token) {
            user.setDataValue('token', '');
            await user.save();
            res.status(401).json({ error: 'Token mismatch' });
            return;
        }

        res.locals.token = token;
        res.locals.decodedToken = decodedToken;
    }

    next();
};
