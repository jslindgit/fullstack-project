interface Props {
    isChecked: boolean;
    onClick: () => void;
}

const CheckBox = ({ isChecked, onClick }: Props) => {
    return (
        <>
            <div className={'customCheckBox' + (isChecked ? ' checked' : '')} onClick={onClick}>
                {isChecked && '✔'}
            </div>
        </>
    );
};

export default CheckBox;
