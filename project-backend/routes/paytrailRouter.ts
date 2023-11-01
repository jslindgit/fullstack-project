import express, { RequestHandler } from 'express';

import { errorHandler } from '../middlewares/errors';
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

router.use(errorHandler);

export default router;
