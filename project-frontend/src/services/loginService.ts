import axios, { AxiosError } from 'axios';

import { LoginResponse, User } from '../types/types';
import { isUser } from '../types/type_functions';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/error_handler';
import localstorage_handler from '../util/localstorage_handler';

const url = apiBaseUrl + '/login';

const login = async (username: string, password: string, setLoggedUser: (loggedUser: User) => void): Promise<LoginResponse> => {
    try {
        const res = await axios.post(url, { username: username, password: password });

        if (res.status === 200 && isUser(res.data.response)) {
            localstorage_handler.setToken(res.data.response.token);
            setLoggedUser(res.data.response);
            return { success: true, message: `Logged in as ${res.data.response.username}` };
        } else {
            return { success: false, message: 'Something went wrong, please try again later...' };
        }
    } catch (err: unknown) {
        handleError(err);
        if (err instanceof AxiosError && err.response?.status === 401) {
            return { success: false, message: 'Invalid username or password' };
        } else {
            return { success: false, message: 'Something went wrong' };
        }
    }
};

const logout = async (token: string, removeLoggedUser: () => void) => {
    localstorage_handler.removeToken();
    removeLoggedUser();

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
