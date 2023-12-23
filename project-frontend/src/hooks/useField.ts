import { useState, ChangeEvent } from 'react';

import { ContentID } from '../content';
import { isNumber } from '../types/typeFunctions';

export interface UseField {
    anyChanges: boolean;
    label: ContentID;
    numValue: () => number;
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
            const parsedInput = input.replace(',', '.');
            if (isNumber(Number(parsedInput)) && !Number.isNaN(Number(parsedInput))) {
                const lastChar = parsedInput.charAt(parsedInput.length - 1);
                return lastChar === '.' ? parsedInput : parseFloat(parsedInput).toString();
            } else {
                return currentValue;
            }
        default:
            return input;
    }
};

const useField = (type: 'text' | 'integer' | 'decimal' | 'password', fieldLabel: ContentID | null, initialValue: string | undefined = undefined): UseField => {
    const initValue = (): string | number => {
        if (initialValue) {
            return convertInput(initialValue, type, initialValue);
        } else {
            //return type === 'text' || type === 'password' ? '' : 0;
            return '';
        }
    };

    const [value, setValue] = useState(initValue());
    const [anyChanges, setAnyChanges] = useState<boolean>(false);

    const numValue = (): number => {
        return Number(value.toString().trim());
    };

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
        numValue,
        onChange,
        reset,
        setNewValue,
        stringValue,
        type,
        value,
    };
};

export default useField;
