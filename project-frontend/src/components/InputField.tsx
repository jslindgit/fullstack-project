import { UseField } from '../hooks/useField';

interface Props {
    autoFocus?: boolean;
    className?: string;
    minWidth?: string;
    placeHolder?: string;
    testId?: string;
    useField: UseField;
    width: string | number;
}

const InputField = ({ className, minWidth, useField, width, placeHolder = '', autoFocus = false, testId = '' }: Props) => (
    <input
        data-testid={testId}
        className={className ? className : ''}
        onChange={useField.onChange}
        placeholder={placeHolder}
        style={{ width: width, minWidth: minWidth ? minWidth : '' }}
        type={useField.type}
        value={useField.value}
        autoFocus={autoFocus}
    />
);

export default InputField;
