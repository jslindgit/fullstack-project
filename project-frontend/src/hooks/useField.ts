import { useState, ChangeEvent } from 'react';

import { ContentID } from '../content';

export interface UseField {
    anyChanges: boolean;
    label: ContentID;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    reset: () => void;
    setNewValue: (newValue: string) => void;
    stringValue: () => string;
    type: 'text' | 'integer' | 'decimal' | 'password';
    value: string | number;
}

const convertInput = (input: string, type: string, currentValue: string): string => {
    if (input === '') {
        return input;
    }

    switch (type) {
        case 'integer':
            if (Number.isInteger(Number(input))) {
                return parseInt(input).toString();
            } else {
                return currentValue;
            }
        case 'decimal':
            const lastChar = input.charAt(input.length - 1);
            return lastChar === '.' ? input : parseFloat(input).toString();
        default:
            return input;
    }
};

const useField = (type: 'text' | 'integer' | 'decimal' | 'password', fieldLabel: ContentID | null, initialValue: string | undefined = undefined): UseField => {
    const initValue = (): string | number => {
        if (initialValue) {
            return convertInput(initialValue, type, initialValue);
        } else {
            return type === 'text' || type === 'password' ? '' : 0;
        }
    };

    const [value, setValue] = useState(initValue());
    const [anyChanges, setAnyChanges] = useState<boolean>(false);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(convertInput(event.target.value, type, value.toString()));
        setAnyChanges(true);
    };

    const reset = () => {
        setValue('');
    };

    const setNewValue = (newValue: string) => {
        setValue(convertInput(newValue, type, value.toString()));
    };

    const stringValue = (): string => {
        return value.toString().trim();
    };

    return {
        anyChanges,
        label: fieldLabel ? fieldLabel : ContentID._NONE,
        onChange,
        reset,
        setNewValue,
        stringValue,
        type,
        value,
    };
};

export default useField;
