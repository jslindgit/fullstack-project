export const imageFilename = (path: string): string => {
    const parts = path.split('\\');
    return parts.length > 0 ? parts[parts.length - 1] : '';
};

export const imageFullPath = (subdirAndFilename: string) => {
    return 'http://localhost:3001/images/' + subdirAndFilename;
};

export const imageSubdir = (path: string): string => {
    const parts = path.split('\\');
    return parts.length > 0 ? parts[0] : '';
};

export const isValidEmailAddress = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string) => {
    return password.length >= 10;
};
