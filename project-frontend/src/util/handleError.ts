import axios from 'axios';

import { isString } from '../types/typeFunctions';

export const handleError = (error: unknown): void => {
    console.trace();

    let errorMessage: string = 'Error occurred';

    if (axios.isAxiosError(error)) {
        errorMessage = 'Axios error.';
        if (error.response) {
            console.error('error.response.data:', error.response.data);
            console.error('error.response.status:', error.response.status);
            console.error('error.response.headers:', error.response.headers);
        } else if (error.request) {
            console.error('error.request:', error.request);
        } else {
            console.error('error.message:', error.message);
        }
    } else if (error instanceof Error) {
        errorMessage = error.name + ': ' + error.message;
    } else if (isString(error)) {
        errorMessage = error;
    }

    console.error(`error_handler.handleError: ${errorMessage}`);
};
