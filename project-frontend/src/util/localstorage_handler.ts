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

export default {
    getToken,
    removeToken,
    setToken,
};
