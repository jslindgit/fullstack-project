import { UseField } from '../hooks/useField';

interface Props {
    className?: string;
    placeHolder?: string;
    useField: UseField;
    width: string | number;
}

const InputField = ({ className, useField, width, placeHolder = '' }: Props) => (
    <input
        className={className ? className : ''}
        onChange={useField.onChange}
        placeholder={placeHolder}
        style={{ width: width }}
        type={useField.type}
        value={useField.value}
        autoFocus
    />
);

export default InputField;
