import { AxiosError } from 'axios';

export const handleError = (err: unknown, additionalInfo: string = ''): void => {
    console.trace();

    let errorMessage = 'Something went wrong.';
    if (err instanceof Error) {
        errorMessage = `${err.name}: ${err.message}`;

        if (err instanceof AxiosError) {
            errorMessage += ` (AxiosError.Status: ${err.response?.status}: "${err.response?.data.error}")`;
        }
    }

    console.error(`error_handler.handleError [${additionalInfo}]: ${errorMessage}`);
    //throw new Error(errorMessage);
};
