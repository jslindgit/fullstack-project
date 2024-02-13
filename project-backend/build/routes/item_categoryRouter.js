"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const errors_1 = require("../middlewares/errors");
const item_categoryService_1 = __importDefault(require("../services/item_categoryService"));
const type_functions_1 = require("../types/type_functions");
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const router = express_1.default.Router();
router.delete('/item_and_category_id', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            if ((0, type_functions_1.isObject)(req.body) && 'item_id' in req.body && 'category_id' in req.body) {
                const item_category = await item_categoryService_1.default.deleteByItemAndCategoryId(req.body.item_id, req.body.category_id);
                if (item_category) {
                    res.status(204).end();
                }
                else {
                    res.status(404).json({ error: 'Matching Item_Category not found' });
                }
            }
            else {
                res.status(400).json({ error: 'itemId or categoryId missing from req.body' });
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
router.get('/', (async (_req, res, next) => {
    try {
        const item_categories = await item_categoryService_1.default.getAll();
        res.json(item_categories);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', tokenExtractor_1.tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true || res.locals.operator === true) {
            const newItem_Category = (0, type_functions_1.toNewItem_Category)(req.body);
            const addedItem_Category = await item_categoryService_1.default.addNew(newItem_Category);
            res.status(201).json(addedItem_Category);
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
/*router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedItem_Category = await service.deleteById(req.params.id);
            if (deletedItem_Category) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `Item_Category with id ${req.params.id} not found`,
                });
            }
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);*/
/*router.get('/item_and_category_id', (async (req, res, next) => {
    try {
        if (isObject(req.body) && 'item_id' in req.body && 'category_id' in req.body) {
            const item_category = await service.getByItemAndCategoryId(req.body.item_id, req.body.category_id);
            if (item_category) {
                res.json(item_category);
            } else {
                res.status(404).json({ error: 'Not found' });
            }
        } else {
            res.status(400).json({ error: 'itemId or categoryId missing from req.body' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);*/
/*router.get('/:id', (async (req, res, next) => {
    try {
        const item_category = await service.getById(req.params.id);
        if (item_category) {
            res.json(item_category);
        } else {
            res.status(404).json({
                error: `Item_Category with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);*/
