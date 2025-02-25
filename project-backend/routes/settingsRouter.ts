import express from 'express';
import { RequestHandler } from 'express';

import { apiKeyExtractor } from '../middlewares/apiKeyExtractor';
import { errorHandler } from '../middlewares/errors';
import service from '../services/settingsService';
import { tokenExtractor } from '../middlewares/tokenExtractor';
import { toNewSettings } from '../types/type_functions';

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res) => {
    const settings = await service.getById(req.params.id);
    if (!settings) {
        res.status(404).end();
    } else {
        if (res.locals.admin === true) {
            const deletedSettings = await service.deleteById(req.params.id);
            if (deletedSettings) {
                res.status(204).end();
            } else {
                res.status(500).end();
            }
        } else {
            res.status(403).end();
        }
    }
}) as RequestHandler);

router.get('/', apiKeyExtractor, (async (_req, res) => {
    if (res.locals.correct_api_key || !res.locals.correct_api_key) {
        const settings = await service.getAll();
        res.json(settings);
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.get('/:id', apiKeyExtractor, (async (req, res) => {
    if (res.locals.correct_api_key) {
        const settings = await service.getById(req.params.id);
        if (settings) {
            res.json(settings);
        } else {
            res.status(404).end();
        }
    } else {
        res.status(401).end();
    }
}) as RequestHandler);

router.post('/', tokenExtractor, (async (req, res) => {
    if (res.locals.admin === true) {
        const newSettings = toNewSettings(req.body);
        const addedSettings = await service.addNew(newSettings);

        res.status(201).json(addedSettings);
    } else {
        res.status(403).end();
    }
}) as RequestHandler);

router.put('/:id', tokenExtractor, (async (req, res) => {
    if (res.locals.admin === true) {
        const settings = await service.getById(req.params.id);
        if (!settings) {
            res.status(404);
        } else {
            if (res.locals.admin === true || res.locals.operator === true) {
                const updatedSettings = await service.update(req.params.id, req.body);
                if (updatedSettings) {
                    res.status(200).json(updatedSettings);
                } else {
                    res.status(500).end();
                }
            } else {
                res.status(403).end();
            }
        }
    } else {
        res.status(403).end();
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
