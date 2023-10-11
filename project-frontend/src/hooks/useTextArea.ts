import { useState, ChangeEvent } from 'react';

export interface UseTextArea {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    reset: () => void;
    setNewValue: (newValue: string) => void;
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

    return {
        value,
        onChange,
        reset,
        setNewValue,
        anyChanges,
    };
};

export default useTextArea;
