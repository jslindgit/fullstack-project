"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiKeyExtractor_1 = require("../middlewares/apiKeyExtractor");
const errors_1 = require("../middlewares/errors");
const error_handler_1 = require("../util/error_handler");
const order_1 = require("../models/order");
const type_functions_1 = require("../types/type_functions");
const paytrailService_1 = __importDefault(require("../services/paytrailService"));
const router = express_1.default.Router();
router.get('/test_payment', (async (_req, res, next) => {
    try {
        const paytrailResponse = await paytrailService_1.default.testPaymentRequest();
        if (paytrailResponse.success) {
            res.status(200).json(paytrailResponse.data);
        }
        else {
            res.status(500).json({ error: paytrailResponse.message });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/payment', (async (req, res, next) => {
    try {
        if ((0, order_1.isOrderInstance)(req.body)) {
            const order = req.body;
            const paytrailResponse = await paytrailService_1.default.paymentRequest(order);
            if (paytrailResponse.success) {
                res.status(200).json(paytrailResponse.data);
            }
            else {
                res.status(500).json({ error: paytrailResponse.message });
            }
        }
        else {
            console.log('req.body:', req.body);
            (0, error_handler_1.handleError)(new Error('req.body is not a valid NewOrder'));
            res.status(400).json({ error: 'Request body is not a valid OrderInstance' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/validate', apiKeyExtractor_1.apiKeyExtractor, ((req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            if ((0, type_functions_1.isObject)(req.body) && 'url' in req.body && (0, type_functions_1.isString)(req.body.url)) {
                const isValid = paytrailService_1.default.validateSignatureFromUrl(req.body.url);
                res.status(isValid ? 200 : 406).json({ message: isValid ? 'Ok' : 'Signature mismatch' });
            }
            else {
                res.status(400).json({ error: 'url missing from request body' });
            }
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.use(errors_1.errorHandler);
exports.default = router;
