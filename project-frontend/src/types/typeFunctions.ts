export const isBoolean = (text: unknown): text is boolean => {
    return typeof text === 'boolean' || text instanceof Boolean;
};

export const isNotNull = <T>(value: T | null | undefined): value is T => {
    return value !== null && value !== undefined;
};

export const isNumber = (text: unknown): text is number => {
    return (typeof text === 'number' || text instanceof Number) && !isNaN(Number(text));
};

export const isObject = (variable: unknown): variable is object => {
    return variable !== null && (typeof variable === 'object' || variable instanceof Object);
};

export const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};
