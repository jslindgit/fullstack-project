export const logError = (err: unknown) => {
    console.log(err instanceof Error ? err.message : 'Something went wrong');
};
