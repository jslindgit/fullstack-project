"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const errors_1 = require("../middlewares/errors");
const categoryService_1 = __importDefault(require("../services/categoryService"));
const type_functions_1 = require("../types/type_functions");
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const router = express_1.default.Router();
router.delete('/:id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        const category = await categoryService_1.default.getById(req.params.id);
        if (!category) {
            res.status(404).end();
        }
        else {
            if (res.locals.admin === true || (res.locals.operator === true && category.addedBy && category.addedBy === res.locals.user_id)) {
                const deletedCategory = await categoryService_1.default.deleteById(req.params.id);
                if (deletedCategory) {
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
router.get('/', (async (req, res, next) => {
    try {
        const categories = await categoryService_1.default.getAll((0, type_functions_1.isString)(req.query.search) ? req.query.search : '');
        res.json(categories);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', (async (req, res, next) => {
    try {
        const category = await categoryService_1.default.getById(req.params.id);
        if (category) {
            res.json(category);
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
        if ((res.locals.admin === true || res.locals.operator === true) && res.locals.user_id && (0, type_functions_1.isNumber)(res.locals.user_id)) {
            const newCategory = (0, type_functions_1.toNewCategory)(req.body);
            const addedCategory = await categoryService_1.default.addNew({ ...newCategory, addedBy: res.locals.user_id });
            res.status(201).json(addedCategory);
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
        const category = await categoryService_1.default.getById(req.params.id);
        if (!category) {
            res.status(404);
        }
        else {
            if (res.locals.admin === true || (res.locals.operator === true && category.addedBy && category.addedBy === res.locals.user_id)) {
                const updatedCategory = await categoryService_1.default.update(req.params.id, req.body);
                if (updatedCategory) {
                    res.status(200).json(updatedCategory);
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
