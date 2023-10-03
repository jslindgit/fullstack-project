import { useState, ChangeEvent } from 'react';

import { isNumber, isString } from '../types/type_functions';

const useField = (type: 'text' | 'number') => {
    const [value, setValue] = useState(type === 'text' ? '' : 0);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
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
            console.log('isNumber (' + newValue + '):', isNumber(newValue) + ' typeof: ' + typeof newValue);
        }
    };

    const parsedValue = type === 'number' ? Number(value) : value;

    return {
        type,
        value: parsedValue,
        onChange,
        reset,
        setNewValue,
    };
};

export default useField;
