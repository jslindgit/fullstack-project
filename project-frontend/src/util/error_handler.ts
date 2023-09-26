import { AxiosError } from 'axios';

export const handleError = (err: unknown): void => {
    let errorMessage = 'Something went wrong.';
    if (err instanceof Error) {
        errorMessage = err.name + ': ' + err.message;

        if (err instanceof AxiosError) {
            errorMessage += ' (AxiosError.Status: ' + err.status + ')';
        }
    }

    console.log('error_handler.handleError:', errorMessage);
    throw new Error(errorMessage);
};
