import axios from 'axios';

import { Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/serviceProvider';
import { handleError } from '../util/handleError';

interface ImageResponse extends Response {
    images: string[];
}

const url = apiBaseUrl + '/images';

const add = async (imageFile: File, subDir: 'misc' | 'products', token: string): Promise<Response> => {
    try {
        const formData = new FormData();
        formData.append('subdir', subDir);
        formData.append('image', imageFile);

        const headersObject = authConfig(token);
        //headersObject.headers = { ...headersObject.headers, 'Content-Type': 'multipart/form-data' };

        const res = await axios.post(url, formData, headersObject);

        console.log('res:', res);

        if (res.status === 201) {
            return { success: true, message: `"${imageFile.name}" uploaded to "${subDir}"` };
        } else {
            return { success: false, message: 'Something went wrong' };
        }

        return { success: res.status === 201, message: 'ok' };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

const deleteImage = async (subDir: string, filename: string, token: string): Promise<Response> => {
    try {
        const res = await axios.post(url, { subdir: subDir, filename: filename }, authConfig(token));

        if (res.status === 200) {
            return { success: true, message: `Image ${subDir}/${filename} deleted` };
        } else {
            return { success: false, message: 'Something went wrong, try again later' };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

const getAll = async (): Promise<ImageResponse> => {
    try {
        const res = await axios.get(url);
        if (res.status === 200) {
            return { success: true, message: 'ok', images: res.data };
        } else {
            return { success: false, message: 'Something went wrong', images: [] };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', images: [] };
    }
};

const getBySubDir = async (subDir: 'misc' | 'products'): Promise<ImageResponse> => {
    try {
        const { data } = await axios.get<string[]>(url + '/' + subDir);
        return { success: true, message: 'ok', images: data };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', images: [] };
    }
};

export default {
    add,
    deleteImage,
    getAll,
    getBySubDir,
};
