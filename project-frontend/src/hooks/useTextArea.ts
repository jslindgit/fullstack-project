import { useState, ChangeEvent } from 'react';

export interface UseTextArea {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    reset: () => void;
    setNewValue: (newValue: string) => void;
    stringValue: () => string;
    anyChanges: boolean;
}

const useTextArea = (): UseTextArea => {
    const [value, setValue] = useState('');
    const [anyChanges, setAnyChanges] = useState<boolean>(false);

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        setAnyChanges(true);
    };

    const reset = () => {
        setValue('');
    };

    const setNewValue = (newValue: string) => {
        setValue(newValue);
    };

    const stringValue = (): string => {
        return value.toString().trim();
    };

    return {
        value,
        onChange,
        reset,
        setNewValue,
        stringValue,
        anyChanges,
    };
};

export default useTextArea;
