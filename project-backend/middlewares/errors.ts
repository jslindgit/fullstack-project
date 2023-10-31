import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('errorHandler:', err);

    if (err.message.includes('NotFoundError')) {
        return res.status(404).json({ error: err.message });
    }

    return res.status(400).json({ error: err.message });
};
