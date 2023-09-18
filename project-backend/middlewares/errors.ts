import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error('errorHandler (' + err.name + '):', err.message);

    if (
        err.name === 'ValidationError' ||
        err.name === 'SequelizeValidationError'
    ) {
        if (err.message.includes('Validation isEmail on username failed')) {
            return res
                .status(400)
                .json({ error: 'Username must be a valid e-mail address' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err.name === 'NotFoundError') {
        return res.status(404).json({ error: err.message });
    }

    return res.status(400).json({ error: err.message });
};
