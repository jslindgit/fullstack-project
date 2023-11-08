import express, { RequestHandler } from 'express';

import { NewOrder } from '../models/order';

import { errorHandler } from '../middlewares/errors';
import { handleError } from '../util/error_handler';
import { isNewOrder } from '../models/order';
import paytrailService from '../services/paytrailService';

const router = express.Router();

router.get('/test_payment', (async (_req, res, next) => {
    try {
        const paytrailResponse = await paytrailService.testPaymentRequest();
        if (paytrailResponse.success) {
            res.status(200).json(paytrailResponse.data);
        } else {
            res.status(500).json({ error: paytrailResponse.message });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/payment', (async (req, res, next) => {
    try {
        console.log('req.body:', req.body);
        if (isNewOrder(req.body)) {
            const newOrder: NewOrder = req.body;

            const paytrailResponse = await paytrailService.paymentRequest(newOrder);

            if (paytrailResponse.success) {
                res.status(200).json(paytrailResponse.data);
            } else {
                res.status(500).json({ error: paytrailResponse.message });
            }
        } else {
            handleError(new Error('req.body is not a valid NewOrder'));
            res.status(400).json({ error: 'Request body is not a valid NewOrder' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
