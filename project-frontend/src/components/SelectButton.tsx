import React, { useState } from 'react';

interface SelectButtonProps {
    label: string;
}

const SelectButton: React.FC<SelectButtonProps> = ({ label }) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    return (
        <button type='button' onClick={() => setIsSelected(!isSelected)}>
            {label} - {isSelected.toString()}
        </button>
    );
};

export default SelectButton;
