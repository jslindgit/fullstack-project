"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const error_handler_1 = require("../util/error_handler");
const itemService_1 = __importDefault(require("./itemService"));
const type_functions_1 = require("../types/type_functions");
const rootDir = path_1.default.join(__dirname, '../images');
const deleteImage = (subDir, filename) => {
    const fullPath = path_1.default.join(rootDir, subDir, filename);
    let success = false;
    fs_1.default.unlink(fullPath, (error) => {
        if (error) {
            success = false;
            console.error(`Error deleting file ${fullPath}:`, error);
        }
        else {
            success = true;
            console.log(`File ${fullPath} deleted.`);
        }
    });
    return { success: success, images: [], message: success ? 'Deleted successfully.' : 'Error occurred.' };
};
const deleteUnusedImages = async () => {
    const allItems = await itemService_1.default.getAll();
    console.log('Deleting unused images...');
    if (allItems) {
        const toDelete = [];
        const res = await getBySubDir('products');
        res.images.forEach((img) => {
            let isUnused = true;
            allItems.forEach((item) => {
                if (item.images.includes(img)) {
                    isUnused = false;
                    return;
                }
            });
            if (isUnused) {
                toDelete.push(img);
            }
        });
        console.log(toDelete.length.toString() + ' unused images found.');
        toDelete.forEach((img) => {
            console.log('Deleting ' + img + '...');
            const filename = img.split('\\')[1];
            deleteImage('products', filename);
        });
    }
};
const getAll = async () => {
    try {
        const misc = await getBySubDir('misc');
        const products = await getBySubDir('products');
        const success = misc.success && products.success;
        const images = success ? misc.images.concat(products.images) : [];
        return { success: success, images: images, message: success ? 'ok' : 'Something went wrong' };
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return { success: false, images: [], message: 'Error occurred' };
    }
};
const getBySubDir = async (subDir) => {
    try {
        const directory = getPath(subDir);
        // Check if the destination directory exists, if not, create it
        fs_1.default.mkdirSync(directory, { recursive: true });
        const readdirAsync = util_1.default.promisify(fs_1.default.readdir);
        const files = await readdirAsync(directory);
        const paths = files.map((filename) => path_1.default.join(subDir, filename));
        return { success: true, images: paths, message: 'ok' };
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return { success: false, images: [], message: 'Error occurred' };
    }
};
const getBySubdirAndFilename = async (reqbody) => {
    try {
        if ((0, type_functions_1.isObject)(reqbody) &&
            'subdir' in reqbody &&
            'filename' in reqbody &&
            (0, type_functions_1.isString)(reqbody.subdir) &&
            (0, type_functions_1.isString)(reqbody.filename) &&
            reqbody.subdir.length > 0 &&
            reqbody.filename.length > 0) {
            const subdir = reqbody.subdir;
            const filename = reqbody.filename;
            const res = await getBySubDir(subdir);
            if (res.success) {
                const matching = res.images.filter((imgFile) => imgFile === path_1.default.join(subdir, filename));
                return { success: true, images: matching, message: matching.length > 0 ? 'Match found' : 'No match' };
            }
            else {
                return { success: false, images: [], message: 'Something went wrong' };
            }
        }
        else {
            return { success: false, images: [], message: 'Invalid query parameters' };
        }
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return { success: false, images: [], message: 'Error occurred' };
    }
};
const getPath = (subDir) => {
    return subDir.length > 0 ? path_1.default.join(rootDir, subDir) : rootDir;
};
exports.default = {
    deleteImage,
    deleteUnusedImages,
    getAll,
    getBySubDir,
    getBySubdirAndFilename,
    getPath,
};
