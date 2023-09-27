import axios, { AxiosError } from 'axios';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/error_handler';
import localstorage_handler from '../util/localstorage_handler';
import { LoggedUser } from '../types/types';

const url = apiBaseUrl + '/login';

const login = async (username: string, password: string, setLoggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>): Promise<string> => {
    try {
        const res = await axios.post(url, { username: username, password: password });

        if (res.status === 200 && 'token' in res.data.response && 'username' in res.data.response && 'admin' in res.data.response) {
            const loggedUser: LoggedUser = {
                token: res.data.response.token,
                username: res.data.response.username,
                admin: res.data.response.admin,
            };
            localstorage_handler.setLoggedUser(loggedUser);
            setLoggedUser(loggedUser);
            return `Logged in as ${res.data.response.username}`;
        } else {
            return 'Something went wrong, please try again later...';
        }
    } catch (err: unknown) {
        console.log('err:', err);

        if (err instanceof AxiosError && err.response?.status === 401) {
            return 'Invalid username or password';
        } else {
            return 'Something went wrong';
        }
    }
};

const logout = async (token: string, setLoggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>) => {
    localstorage_handler.setLoggedUser(null);
    setLoggedUser(null);

    try {
        await axios.delete(url, {
            headers: {
                Authorization: 'bearer ' + token,
            },
        });
    } catch (err: unknown) {
        handleError(err);
    }
};

export default {
    login,
    logout,
};
