import { ValidationError } from 'sequelize';

export const handleError = (err: unknown): void => {
    let errorMessage = 'Something went wrong.';
    if (err instanceof Error) {
        errorMessage = err.name + ': ' + err.message;

        if (err instanceof ValidationError) {
            errorMessage += ' (';
            err.errors.forEach((e) => {
                errorMessage += e.message + ', ';
            });
            errorMessage =
                errorMessage.substring(0, errorMessage.length - 2) + ')';
        }
    }

    console.log('error_handler.handleError:', errorMessage);
    throw new Error(errorMessage);
};
