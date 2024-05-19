import express, { RequestHandler } from 'express';

import { OrderInstance } from '../models/order';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import { handleError } from '../util/error_handler';
import { isOrderInstance } from '../models/order';
import { isObject, isString } from '../types/type_functions';
import paytrailService from '../services/paytrailService';

const router = express.Router();

router.get('/test_payment', apiKeyExtractor, (async (_req, res) => {
    if (res.locals.correct_api_key) {
        const paytrailResponse = await paytrailService.testPaymentRequest();
        if (paytrailResponse.success) {
            res.status(200).json(paytrailResponse.data);
        } else {
            res.status(500).json({ error: paytrailResponse.message });
        }
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.post('/payment', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        if (isOrderInstance(req.body)) {
            const order: OrderInstance = req.body;

            const paytrailResponse = await paytrailService.paymentRequest(order);

            if (paytrailResponse.success) {
                res.status(200).json(paytrailResponse.data);
            } else {
                res.status(500).json({ error: paytrailResponse.message });
            }
        } else {
            handleError(new Error('req.body is not a valid NewOrder'));
            res.status(400).json({ error: 'Request body is not a valid OrderInstance' });
        }
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.post('/validate', apiKeyExtractor, ((req, res) => {
    if (res.locals.correct_api_key === true) {
        if (isObject(req.body) && 'url' in req.body && isString(req.body.url)) {
            const isValid = paytrailService.validateSignatureFromUrl(req.body.url);

            res.status(isValid ? 200 : 406).json({ message: isValid ? 'Ok' : 'Signature mismatch' });
        } else {
            res.status(400).json({ error: 'url missing from request body' });
        }
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
