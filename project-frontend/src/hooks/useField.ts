import { useState, ChangeEvent } from 'react';

import { ContentID } from '../content';
import { isNumber } from '../types/typeFunctions';

export interface UseField {
    anyChanges: boolean;
    clear: () => void;
    label: ContentID;
    numValue: () => number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    reset: () => void;
    setNewValue: (newValue: string) => void;
    stringValue: () => string;
    type: 'text' | 'integer' | 'decimal' | 'password' | 'phone';
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
        case 'phone':
            const numeric = '0123456789';
            for (let i = 0; i < input.length; i++) {
                if (i === 0) {
                    if (!(numeric.includes(input[i]) || input[i] === '+')) {
                        return currentValue;
                    }
                } else {
                    if (!(numeric.includes(input[i]) || (' -'.includes(input[i]) && numeric.includes(input[i - 1])))) {
                        return currentValue;
                    }
                }
            }
            return input;
        default:
            return input;
    }
};

const useField = (
    type: 'text' | 'integer' | 'decimal' | 'password' | 'phone',
    fieldLabel: ContentID | null,
    initialValue: string | undefined = undefined
): UseField => {
    const initValue = (): string | number => {
        if (initialValue) {
            return convertInput(initialValue, type, initialValue);
        } else {
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

    const clear = () => {
        setValue('');
    };

    const reset = () => {
        setValue(initValue());
    };

    const setNewValue = (newValue: string) => {
        setValue(convertInput(newValue, type, value.toString()));
    };

    const stringValue = (): string => {
        return value.toString().trim();
    };

    return {
        anyChanges,
        clear,
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
