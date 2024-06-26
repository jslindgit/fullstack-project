import axios from 'axios';
import { ValidationError } from 'sequelize';

export const handleError = (error: unknown): void => {
    console.trace();

    if (axios.isAxiosError(error)) {
        console.error('Axios error.');
        if (error.response) {
            console.error('error.response.data:', error.response.data);
            console.error('error.response.status:', error.response.status);
            console.error('error.response.headers:', error.response.headers);
        } else if (error.request) {
            console.error('error.request:', error.request);
        } else {
            console.error('error.message:', error.message);
        }
    } else {
        console.error('Non-Axios Error:', error);
    }

    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
        errorMessage = error.name + ': ' + error.message;

        if (error instanceof ValidationError) {
            errorMessage += ' (';
            error.errors.forEach((e) => {
                errorMessage += e.message + ', ';
            });
            errorMessage = errorMessage.substring(0, errorMessage.length - 2) + ')';
        }
    }

    console.error(`error_handler.handleError: ${errorMessage}`);
    throw new Error(errorMessage);
};
