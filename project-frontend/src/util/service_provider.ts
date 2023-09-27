export const authConfig = (token: string): object => {
    return {
        headers: {
            Authorization: 'bearer ' + token,
        },
    };
};
