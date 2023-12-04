// Previous location:
const getPreviousLocation = (): string => {
    const location = localStorage.getItem('previousLocation');
    return location ? location : '/';
};

const setPreviousLocation = (location: string): void => {
    localStorage.setItem('previousLocation', location);
};

export default {
    getPreviousLocation,
    setPreviousLocation,
};
