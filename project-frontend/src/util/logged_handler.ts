import { LoggedUser } from '../types/types';

export const setLoggedUser = (token: string, username: string): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
};

export const getLoggedUser = (): LoggedUser | null => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
        return {
            token: token,
            username: username,
        };
    } else {
        return null;
    }
};
