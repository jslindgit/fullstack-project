import { API_KEY } from '../constants';

interface AuthInterface {
    headers: object;
}

export const apiKeyConfig = (): AuthInterface => {
    return {
        headers: {
            Authorization: 'api_key ' + API_KEY,
        },
    };
};

export const authConfig = (token: string): AuthInterface => {
    return {
        headers: {
            Authorization: 'bearer ' + token,
        },
    };
};
