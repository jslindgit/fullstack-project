import { UseField } from '../hooks/useField';

interface Props {
    useField: UseField;
    width: string;
}

const InputField = ({ useField, width }: Props) => <input type={useField.type} value={useField.value} onChange={useField.onChange} style={{ width: width }} />;

export default InputField;
