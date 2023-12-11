interface Props {
    isChecked: boolean;
    onClick: () => void;
}

const CheckBox = ({ isChecked, onClick }: Props) => {
    return (
        <table className={'customCheckBox' + (isChecked ? ' checked' : '')}>
            <tbody>
                <tr>
                    <td onClick={onClick}>{isChecked ? '✔' : ''}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default CheckBox;
