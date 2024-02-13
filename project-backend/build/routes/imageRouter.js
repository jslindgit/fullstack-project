"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../middlewares/errors");
const type_functions_1 = require("../types/type_functions");
const imageService_1 = __importDefault(require("../services/imageService"));
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const storage = multer_1.default.diskStorage({
    destination: (req, _file, cb) => {
        let destinationPath = './images';
        if ((0, type_functions_1.isObject)(req.body) && 'subdir' in req.body && (0, type_functions_1.isString)(req.body.subdir)) {
            destinationPath = imageService_1.default.getPath(req.body.subdir);
        }
        console.log('destPath:', destinationPath);
        // Check if the destination directory exists, if not, create it
        fs_1.default.mkdirSync(destinationPath, { recursive: true });
        cb(null, destinationPath);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.get('/', (async (_req, res, next) => {
    try {
        const imageResponse = await imageService_1.default.getAll();
        if (imageResponse.success) {
            res.json(imageResponse.images);
        }
        else {
            res.status(500).json({ error: imageResponse.message });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.get('/subdir/:subdir', (async (req, res, next) => {
    try {
        const imageResponse = await imageService_1.default.getBySubDir(req.params.subdir);
        if (imageResponse.success) {
            res.status(200).json(imageResponse.images);
        }
        else {
            res.status(500).json({ error: imageResponse.message });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', tokenExtractor_1.tokenExtractor, upload.single('image'), ((_req, res, next) => {
    try {
        if (res.locals.admin === true || res.locals.operator === true) {
            res.status(201).send('Image uploaded successfully');
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/search', (async (req, res, next) => {
    try {
        const imageResponse = await imageService_1.default.getBySubdirAndFilename(req.body);
        if (imageResponse.success) {
            res.status(200).json({ images: imageResponse.images, message: imageResponse.message });
        }
        else {
            res.status(500).json({ error: imageResponse.message });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.use(errors_1.errorHandler);
exports.default = router;
