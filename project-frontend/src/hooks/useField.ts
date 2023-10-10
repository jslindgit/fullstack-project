import { useState, ChangeEvent } from 'react';

import { isNumber, isString } from '../types/type_functions';

import { handleError } from '../util/handleError';

export interface UseField {
    type: 'text' | 'number' | 'password';
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    reset: () => void;
    setNewValue: (newValue: unknown) => void;
    anyChanges: boolean;
}

const useField = (type: 'text' | 'number' | 'password'): UseField => {
    const [value, setValue] = useState(type === 'text' ? '' : 0);
    const [anyChanges, setAnyChanges] = useState<boolean>(false);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        setAnyChanges(true);
    };

    const reset = () => {
        setValue('');
    };

    const setNewValue = (newValue: unknown) => {
        if (type === 'text' && isString(newValue)) {
            setValue(newValue);
        } else if (type === 'number' && isNumber(newValue)) {
            setValue(newValue);
        } else {
            handleError(new Error('Invalid value type'));
        }
    };

    const parsedValue = type === 'number' ? Number(value) : value;

    return {
        type,
        value: parsedValue,
        onChange,
        reset,
        setNewValue,
        anyChanges,
    };
};

export default useField;
