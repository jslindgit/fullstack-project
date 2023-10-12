import { useState, ChangeEvent } from 'react';

export interface UseField {
    type: 'text' | 'integer' | 'decimal' | 'password';
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    reset: () => void;
    setNewValue: (newValue: string) => void;
    anyChanges: boolean;
}

const convertInput = (input: string, type: string): string => {
    if (input === '') {
        return input;
    }

    switch (type) {
        case 'integer':
            return parseInt(input).toString();
        case 'decimal':
            const lastChar = input.charAt(input.length - 1);
            return lastChar === '.' ? input : parseFloat(input).toString();
        default:
            return input;
    }
};

const useField = (type: 'text' | 'integer' | 'decimal' | 'password', initialValue: string | undefined = undefined): UseField => {
    const initValue = (): string | number => {
        if (initialValue) {
            return convertInput(initialValue, type);
        } else {
            return type === 'text' || type === 'password' ? '' : 0;
        }
    };

    const [value, setValue] = useState(initValue());
    const [anyChanges, setAnyChanges] = useState<boolean>(false);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(convertInput(event.target.value, type));
        setAnyChanges(true);
    };

    const reset = () => {
        setValue('');
    };

    const setNewValue = (newValue: string) => {
        setValue(convertInput(newValue, type));
    };

    return {
        type,
        value,
        onChange,
        reset,
        setNewValue,
        anyChanges,
    };
};

export default useField;
