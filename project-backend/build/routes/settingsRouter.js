"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const errors_1 = require("../middlewares/errors");
const settingsService_1 = __importDefault(require("../services/settingsService"));
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const type_functions_1 = require("../types/type_functions");
const router = express_1.default.Router();
router.delete('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const settings = await settingsService_1.default.getById(req.params.id);
        if (!settings) {
            res.status(404).end();
        }
        else {
            if (res.locals.admin === true) {
                const deletedSettings = await settingsService_1.default.deleteById(req.params.id);
                if (deletedSettings) {
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
        const settings = await settingsService_1.default.getAll();
        res.json(settings);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', (async (req, res, next) => {
    try {
        const settings = await settingsService_1.default.getById(req.params.id);
        if (settings) {
            res.json(settings);
        }
        else {
            res.status(404).end();
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const newSettings = (0, type_functions_1.toNewSettings)(req.body);
            const addedSettings = await settingsService_1.default.addNew(newSettings);
            res.status(201).json(addedSettings);
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
        const settings = await settingsService_1.default.getById(req.params.id);
        if (!settings) {
            res.status(404);
        }
        else {
            if (res.locals.admin === true || res.locals.operator === true) {
                const updatedSettings = await settingsService_1.default.update(req.params.id, req.body);
                if (updatedSettings) {
                    res.status(200).json(updatedSettings);
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
router.use(errors_1.errorHandler);
exports.default = router;
