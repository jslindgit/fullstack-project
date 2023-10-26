import { useEffect } from 'react';
import useField, { UseField } from '../hooks/useField';

import { Contact } from '../types/orderTypes';

interface Props {
    currentInfo: Contact | null;
    setCustomerInfo: (info: Contact) => void;
    width: string;
}

const CheckOutContactInfo = ({ currentInfo, setCustomerInfo, width }: Props) => {
    const name = useField('text', currentInfo?.name ? currentInfo.name : '');
    const organization = useField('text', currentInfo?.organization ? currentInfo.organization : '');
    const address = useField('text', currentInfo?.address ? currentInfo.address : '');
    const zipcode = useField('text', currentInfo?.zipcode ? currentInfo.zipcode : '');
    const city = useField('text', currentInfo?.city ? currentInfo.city : '');
    const country = useField('text', currentInfo?.country ? currentInfo.country : '');
    const email = useField('text', currentInfo?.email ? currentInfo.email : '');
    const phone = useField('text', currentInfo?.phone ? currentInfo.phone : '');

    useEffect(() => {
        const contact: Contact = {
            name: name.value.toString(),
            organization: organization.value.toString(),
            address: address.value.toString(),
            zipcode: zipcode.value.toString(),
            city: city.value.toString(),
            country: country.value.toString(),
            email: email.value.toString(),
            phone: phone.value.toString(),
        };

        setCustomerInfo(contact);
    }, [name.value, organization.value, address.value, zipcode.value, city.value, country.value, email.value, phone.value]);

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
