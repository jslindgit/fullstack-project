import { useState, ChangeEvent } from 'react';

const useField = (type: string) => {
    const [value, setValue] = useState(type === 'text' ? '' : 0);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const reset = () => {
        setValue('');
    };

    const parsedValue = type === 'number' ? Number(value) : value;

    return {
        type,
        value: parsedValue,
        onChange,
        reset,
    };
};

export default useField;
