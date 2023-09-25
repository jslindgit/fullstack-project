import axios, { AxiosError } from 'axios';

import { apiBaseUrl } from '../constants';

const url = apiBaseUrl + '/login';

const login = async (username: string, password: string): Promise<string> => {
    try {
        const res = await axios.post(url, { username: username, password: password });

        if (res.status === 200 && 'token' in res.data.response && 'username' in res.data.response) {
            localStorage.setItem('token', res.data.response.token);
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
    const res = await axios.delete(url, {
        headers: {
            Authorization: 'bearer ' + token,
        },
    });

    console.log(res);
};

export default {
    login,
    logout,
};
