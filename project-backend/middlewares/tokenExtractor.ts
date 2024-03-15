import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { isNumber, isObject } from '../types/type_functions';
import { SECRET } from '../util/config';
import { User } from '../models';

export const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
    res.locals.token = undefined;
    res.locals.user_id = undefined;
    res.locals.admin = false;
    res.locals.operator = false;

    const authorization = req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        const token = authorization.substring(7);
        const decodedToken = jwt.verify(token, SECRET);

        if (isObject(decodedToken) && 'id' in decodedToken && isNumber(decodedToken.id)) {
            User.findByPk(decodedToken.id)
                .then((user) => {
                    if (!user) {
                        res.status(401).json({ error: 'User matching the token not found' });
                        return;
                    }
                    if (user.getDataValue('disabled') === true) {
                        user.setDataValue('token', '');
                        user.save()
                            .then(() => {
                                res.status(401).json({ error: 'Account is disabled' });
                                return;
                            })
                            .catch((err) => {
                                next(err);
                            });
                    } else if (user.getDataValue('token') !== token) {
                        user.setDataValue('token', '');
                        user.save()
                            .then(() => {
                                res.status(401).json({ error: 'Token mismatch' });
                                return;
                            })
                            .catch((err) => {
                                next(err);
                            });
                    } else {
                        res.locals.token = token;
                        res.locals.user_id = decodedToken.id as number;
                        res.locals.admin = user.getDataValue('admin') === true;
                        res.locals.operator = user.getDataValue('operator') === true;
                    }

                    next();
                })
                .catch((err) => {
                    next(err);
                });
        } else {
            next();
        }
    } else {
        next();
    }
};
