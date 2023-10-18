export const imageCategories: string[] = ['misc', 'products'];

export const imageFullPath = (subdirAndFilename: string) => {
    return 'http://localhost:3001/images/' + subdirAndFilename;
};
