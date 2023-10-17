/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { errorHandler } from '../middlewares/errors';
import { tokenExtractor } from '../middlewares/token_extractor';
import service from '../services/imageService';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, './images');
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.delete('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const deletedImage = await service.deleteById(req.params.id);
            if (deletedImage) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    error: `Image with id ${req.params.id} not found`,
                });
            }
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/', ((_req, res, next) => {
    try {
        const imageDirectory = path.join(__dirname, '../images');

        console.log('imgDir:', imageDirectory);

        fs.readdir(imageDirectory, (err, files) => {
            if (err) {
                res.status(500).json({ error: 'Error reading image directory' });
                next(err);
            } else {
                res.json(files);
            }
        });
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/:id', (async (req, res, next) => {
    try {
        const image = await service.getById(req.params.id);
        if (image) {
            res.json(image);
        } else {
            res.status(404).json({
                error: `Image with id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', tokenExtractor, upload.single('image'), ((_req, res, next) => {
    try {
        if (res.locals.admin === true) {
            //const newImage = toNewImage(req.body);
            //const addedImage = await service.addNew(newImage);

            //res.status(201).json(addedImage);
            res.status(201).send('Image uploaded successfully');
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.put('/:id', tokenExtractor, (async (req, res, next) => {
    try {
        if (res.locals.admin === true) {
            const image = await service.update(req.params.id, req.body);
            if (image) {
                res.status(201).json(image);
                return;
            } else {
                res.status(404).json({
                    error: `Image with id ${req.params.id} not found`,
                });
            }
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
