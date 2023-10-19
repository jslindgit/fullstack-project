export const imageCategories: string[] = ['misc', 'products'];

export const imageFilename = (path: string): string => {
    const parts = path.split('\\');
    return parts.length > 0 ? parts[parts.length - 1] : '';
};

export const imageFullPath = (subdirAndFilename: string) => {
    return 'http://localhost:3001/images/' + subdirAndFilename;
};
