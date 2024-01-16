import { UseField } from '../hooks/useField';

interface Props {
    autoFocus?: boolean;
    className?: string;
    placeHolder?: string;
    useField: UseField;
    width: string | number;
}

const InputField = ({ className, useField, width, placeHolder = '', autoFocus = false }: Props) => (
    <input
        className={className ? className : ''}
        onChange={useField.onChange}
        placeholder={placeHolder}
        style={{ width: width }}
        type={useField.type}
        value={useField.value}
        autoFocus={autoFocus}
    />
);

export default InputField;
