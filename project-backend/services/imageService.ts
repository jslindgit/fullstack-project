import fs from 'fs';
import path from 'path';
import util from 'util';

import { handleError } from '../util/error_handler';
import { isObject, isString } from '../types/type_functions';

interface ImageResponse {
    success: boolean;
    images: string[];
    message: string;
}

const rootDir = path.join(__dirname, '../images');

const deleteImage = (subDir: 'misc' | 'products', filename: string): ImageResponse => {
    const directory = path.join(rootDir, subDir);

    console.log(`Deleting ${filename} from ${directory}... (TODO)`);

    return { success: false, images: [], message: 'TODO...' };
};

const getAll = async (): Promise<ImageResponse> => {
    try {
        const misc = await getBySubDir('misc');
        const products = await getBySubDir('products');

        const success = misc.success && products.success;

        const images = success ? misc.images.concat(products.images) : [];

        return { success: success, images: images, message: success ? 'ok' : 'Something went wrong' };
    } catch (err) {
        handleError(err);
        return { success: false, images: [], message: 'Error occurred' };
    }
};

const getBySubDir = async (subDir: string): Promise<ImageResponse> => {
    try {
        const directory = getPath(subDir);
        const readdirAsync = util.promisify(fs.readdir);
        const files: string[] = await readdirAsync(directory);
        const paths = files.map((filename) => path.join(subDir, filename));

        return { success: true, images: paths, message: 'ok' };
    } catch (err) {
        handleError(err);
        return { success: false, images: [], message: 'Error occurred' };
    }
};

const getBySubdirAndFilename = async (reqbody: unknown): Promise<ImageResponse> => {
    try {
        if (isObject(reqbody) && 'subdir' in reqbody && 'filename' in reqbody && isString(reqbody.subdir) && isString(reqbody.filename) && reqbody.subdir.length > 0 && reqbody.filename.length > 0) {
            const subdir: string = reqbody.subdir;
            const filename: string = reqbody.filename;

            const res = await getBySubDir(subdir);
            if (res.success) {
                const matching = res.images.filter((imgFile) => imgFile === path.join(subdir, filename));
                return { success: true, images: matching, message: matching.length > 0 ? 'Match found' : 'No match' };
            } else {
                return { success: false, images: [], message: 'Something went wrong' };
            }
        } else {
            return { success: false, images: [], message: 'Invalid query parameters' };
        }
    } catch (err) {
        handleError(err);
        return { success: false, images: [], message: 'Error occurred' };
    }
};

const getPath = (subDir: string): string => {
    return subDir.length > 0 ? path.join(rootDir, subDir) : rootDir;
};

export default {
    deleteImage,
    getAll,
    getBySubDir,
    getBySubdirAndFilename,
    getPath,
};