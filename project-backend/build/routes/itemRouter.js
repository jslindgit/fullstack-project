"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const type_functions_1 = require("../types/type_functions");
const apiKeyExtractor_1 = require("../middlewares/apiKeyExtractor");
const errors_1 = require("../middlewares/errors");
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const itemService_1 = __importDefault(require("../services/itemService"));
const router = express_1.default.Router();
router.delete('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const item = await itemService_1.default.getById(req.params.id);
        if (!item) {
            res.status(404).end();
        }
        else {
            if (res.locals.admin === true || (res.locals.operator === true && item.addedBy && item.addedBy === res.locals.user_id)) {
                const deletedItem = await itemService_1.default.deleteById(req.params.id);
                if (deletedItem) {
                    res.status(204).end();
                }
                else {
                    res.status(500).end();
                }
            }
            else {
                res.status(403).end();
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
router.get('/', (async (_req, res, next) => {
    try {
        const items = await itemService_1.default.getAll();
        res.json(items);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', (async (req, res, next) => {
    try {
        const item = await itemService_1.default.getById(req.params.id);
        if (item) {
            res.json(item);
        }
        else {
            res.status(404).json({
                error: `Item with id ${req.params.id} not found`,
            });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        if ((res.locals.admin === true || res.locals.operator === true) && res.locals.user_id && (0, type_functions_1.isNumber)(res.locals.user_id)) {
            const newItem = (0, type_functions_1.toNewItem)(req.body);
            let category_id = null;
            if ((0, type_functions_1.isObject)(req.body) && 'category_id' in req.body && (0, type_functions_1.isNumber)(req.body.category_id)) {
                category_id = req.body.category_id;
            }
            const addedItem = await itemService_1.default.addNew({ ...newItem, addedBy: res.locals.user_id }, category_id);
            res.status(201).json(addedItem);
        }
        else {
            res.status(403).end();
        }
    }
    catch (err) {
        next(err);
    }
}));
router.put('/updateinstockandsold/:id', apiKeyExtractor_1.apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            if ((0, type_functions_1.isObject)(req.body) &&
                'sizes' in req.body &&
                Array.isArray(req.body.sizes) &&
                req.body.sizes.every((s) => (0, type_functions_1.isString)(s)) &&
                'sold' in req.body &&
                (0, type_functions_1.isNumber)(req.body.sold)) {
                const updatedItem = await itemService_1.default.update(req.params.id, { sizes: req.body.sizes, sold: req.body.sold });
                if (updatedItem) {
                    res.status(200).json(updatedItem);
                }
                else {
                    res.status(500).end();
                }
            }
            else {
                res.status(400).json({ error: '"instock" and "sold" properties missing or invalid.' });
            }
        }
        else {
            res.status(403).end();
        }
    }
    catch (err) {
        next(err);
    }
}));
router.put('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const item = await itemService_1.default.getById(req.params.id);
        if (!item) {
            res.status(404).end();
        }
        else {
            if (res.locals.admin === true || (res.locals.operator === true && item.addedBy && item.addedBy === res.locals.user_id)) {
                const updatedItem = await itemService_1.default.update(req.params.id, req.body);
                if (updatedItem) {
                    res.status(200).json(updatedItem);
                    return;
                }
                else {
                    res.status(400).end();
                }
            }
            else {
                res.status(403).end();
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
router.use(errors_1.errorHandler);
exports.default = router;
