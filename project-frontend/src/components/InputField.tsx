import { UseField } from '../hooks/useField';

interface Props {
    placeHolder?: string;
    useField: UseField;
    width: string | number;
}

const InputField = ({ useField, width, placeHolder = '' }: Props) => (
    <input type={useField.type} value={useField.value} onChange={useField.onChange} placeholder={placeHolder} style={{ width: width }} />
);

export default InputField;
