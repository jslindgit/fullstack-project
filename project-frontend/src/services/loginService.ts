import axios, { AxiosError } from 'axios';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/error_handler';
import { setLoggedUser } from '../util/logged_handler';

const url = apiBaseUrl + '/login';

const login = async (username: string, password: string): Promise<string> => {
    try {
        const res = await axios.post(url, { username: username, password: password });

        if (res.status === 200 && 'token' in res.data.response && 'username' in res.data.response) {
            setLoggedUser(res.data.response.token, res.data.response.username);
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

const logout = async (token: string) => {
    try {
        await axios.delete(url, {
            headers: {
                Authorization: 'bearer ' + token,
            },
        });
    } catch (err: unknown) {
        handleError(err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
};

export default {
    login,
    logout,
};
