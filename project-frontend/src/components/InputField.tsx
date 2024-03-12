import { UseField } from '../hooks/useField';

interface Props {
    autoFocus?: boolean;
    className?: string;
    placeHolder?: string;
    testId?: string;
    useField: UseField;
    width: '100%' | '11rem' | '20rem' | '32rem' | '33%';
}

const InputField = ({ className, useField, width, placeHolder = '', autoFocus = false, testId = '' }: Props) => {
    let classNames = className ? className : '';

    switch (width) {
        case '100%':
            classNames += ' widthFull';
            break;
        case '11rem':
            classNames += ' width11rem';
            break;
        case '20rem':
            classNames += ' width20rem';
            break;
        case '32rem':
            classNames += ' width32rem';
            break;
        case '33%':
            classNames += ' width33';
            break;
    }

    return (
        <input
            data-testid={testId}
            className={classNames}
            onChange={useField.onChange}
            placeholder={placeHolder}
            type={useField.type}
            value={useField.value}
            autoFocus={autoFocus}
        />
    );
};

export default InputField;
