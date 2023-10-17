interface AuthInterface {
    headers: object;
}

export const authConfig = (token: string): AuthInterface => {
    return {
        headers: {
            Authorization: 'bearer ' + token,
        },
    };
};
