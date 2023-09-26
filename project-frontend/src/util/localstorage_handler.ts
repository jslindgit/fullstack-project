import { LoggedUser } from '../types/types';

const getLoggedUser = (): LoggedUser | null => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const admin = localStorage.getItem('admin') === 'true';

    if (token && username) {
        return {
            token: token,
            username: username,
            admin: admin,
        };
    } else {
        return null;
    }
};

const setLoggedUser = (loggedUser: LoggedUser | null): void => {
    if (loggedUser) {
        localStorage.setItem('token', loggedUser.token);
        localStorage.setItem('username', loggedUser.username);
        localStorage.setItem('admin', loggedUser.admin.toString());
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('admin');
    }
};

export default {
    setLoggedUser,
    getLoggedUser,
};
