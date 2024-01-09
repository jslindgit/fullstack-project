/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { RequestHandler } from 'express';
import multer from 'multer';

import { errorHandler } from '../middlewares/errors';
import { isObject, isString } from '../types/type_functions';
import service from '../services/imageService';
import { tokenExtractor } from '../middlewares/tokenExtractor';

const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        let destinationPath = './images';
        if (isObject(req.body) && 'subdir' in req.body && isString(req.body.subdir)) {
            destinationPath = service.getPath(req.body.subdir);
        }
        cb(null, destinationPath);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', (async (_req, res, next) => {
    try {
        const imageResponse = await service.getAll();
        if (imageResponse.success) {
            res.json(imageResponse.images);
        } else {
            res.status(500).json({ error: imageResponse.message });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.get('/subdir/:subdir', (async (req, res, next) => {
    try {
        const imageResponse = await service.getBySubDir(req.params.subdir);
        if (imageResponse.success) {
            res.status(200).json(imageResponse.images);
        } else {
            res.status(500).json({ error: imageResponse.message });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/', tokenExtractor, upload.single('image'), ((_req, res, next) => {
    try {
        if (res.locals.admin === true || res.locals.operator === true) {
            res.status(201).send('Image uploaded successfully');
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.post('/search', (async (req, res, next) => {
    try {
        const imageResponse = await service.getBySubdirAndFilename(req.body);
        if (imageResponse.success) {
            res.status(200).json({ images: imageResponse.images, message: imageResponse.message });
        } else {
            res.status(500).json({ error: imageResponse.message });
        }
    } catch (err) {
        next(err);
    }
}) as RequestHandler);

router.use(errorHandler);

export default router;
