// Token:
const getToken = (): string | null => {
    const token = localStorage.getItem('token');

    return token && token.length > 0 ? token : null;
};

const removeToken = (): void => {
    localStorage.removeItem('token');
};

const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

// Previous location:
const getPreviousLocation = (): string => {
    const location = localStorage.getItem('previousLocation');
    return location ? location : '/';
};

const setPreviousLocation = (location: string): void => {
    localStorage.setItem('previousLocation', location);
};

export default {
    getToken,
    removeToken,
    setToken,
    getPreviousLocation,
    setPreviousLocation,
};
