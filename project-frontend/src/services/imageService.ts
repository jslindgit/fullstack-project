import axios from 'axios';

import { Image, Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/serviceProvider';
import { handleError } from '../util/handleError';
import { toNewImage } from '../types/type_functions';

interface ImageResponse extends Response {
    image: Image | null;
}

const url = apiBaseUrl + '/images';

const add = async (imageFile: File, token: string): Promise<ImageResponse> => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const headersObject = authConfig(token);
        headersObject.headers = { ...headersObject.headers, 'Content-Type': 'multipart/form-data' };

        const res = await axios.post(url, formData, headersObject);

        console.log('res:', res);

        return { success: res.status === 201, message: 'ok', image: null };

        /*const newImage = toNewImage(toAdd);

        const body = newImage;
        const { data } = await axios.post(url, body, authConfig(token));

        if ('filename' in data && 'data' in data) {
            return { success: true, message: `New image added: ${data.filename}`, image: data };
        } else {
            handleError('Server did not return an Image object');
            return { success: false, message: 'Something went wrong, try again later', image: null };
        }*/
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', image: null };
    }
};

const deleteImage = async (image: Image, token: string): Promise<Response> => {
    try {
        // First delete the connection tables involving this Image:
        //await item_categoryService.deleteAllConnectionsByItem(item, token);

        const res = await axios.delete<Image>(`${url}/${image.id}`, authConfig(token));
        if (res.status === 204) {
            return { success: true, message: `Image ${image.filename} deleted` };
        } else {
            return { success: false, message: 'Something went wrong, try again later' };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

const getAll = async (): Promise<string[]> => {
    try {
        const { data } = await axios.get<string[]>(url);
        return data;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const getById = async (id: number): Promise<Image | null> => {
    try {
        const { data } = await axios.get<Image>(`${url}/${id}`);
        return data;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

export default {
    add,
    deleteImage,
    getAll,
    getById,
};
