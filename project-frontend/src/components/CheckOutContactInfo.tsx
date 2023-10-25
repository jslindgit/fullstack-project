import useField, { UseField } from '../hooks/useField';

interface Props {
    width: number;
}

const CheckOutContactInfo = ({ width }: Props) => {
    const name = useField('text', '');
    const organization = useField('text', '');
    const address = useField('text', '');
    const zipcode = useField('text', '');
    const city = useField('text', '');
    const country = useField('text', '');
    const email = useField('text', '');
    const phone = useField('text', '');

    const inputField = (label: string, field: UseField) => (
        <>
            <tr>
                <td className='widthByContent'>{label}:</td>
                <td>
                    <input type={field.type} value={field.value} onChange={field.onChange} />
                </td>
            </tr>
        </>
    );

    return (
        <>
            <table align='center' width={width} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3>Customer Contact Information</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={width}>
                <tbody>
                    {inputField('Name', name)}
                    {inputField('Organization (optional)', organization)}
                    {inputField('Street adress', address)}
                    {inputField('Zipcode', zipcode)}
                    {inputField('City', city)}
                    {inputField('Country', country)}
                    {inputField('E-mail', email)}
                    {inputField('Phone', phone)}
                </tbody>
            </table>
        </>
    );
};

export default CheckOutContactInfo;
