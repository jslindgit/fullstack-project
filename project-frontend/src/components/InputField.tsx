import { UseField } from '../hooks/useField';

interface Props {
    className?: string;
    placeHolder?: string;
    useField: UseField;
    width: string | number;
}

const InputField = ({ className, useField, width, placeHolder = '' }: Props) => (
    <input
        type={useField.type}
        value={useField.value}
        onChange={useField.onChange}
        placeholder={placeHolder}
        className={className ? className : ''}
        style={{ width: width }}
    />
);

export default InputField;
