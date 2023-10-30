import { useEffect } from 'react';
import useField, { UseField } from '../hooks/useField';

import { Contact } from '../types/orderTypes';

import { isValidEmailAddress } from '../util/misc';

interface Props {
    currentInfo: Contact | null;
    setCustomerInfo: (info: Contact) => void;
    validate: boolean;
    width: string;
}

const CheckOutContactInfo = ({ currentInfo, setCustomerInfo, validate, width }: Props) => {
    const firstname = useField('text', currentInfo?.firstname ? currentInfo.firstname : '');
    const lastname = useField('text', currentInfo?.lastname ? currentInfo.lastname : '');
    const organization = useField('text', currentInfo?.organization ? currentInfo.organization : '');
    const address = useField('text', currentInfo?.address ? currentInfo.address : '');
    const zipcode = useField('text', currentInfo?.zipcode ? currentInfo.zipcode : '');
    const city = useField('text', currentInfo?.city ? currentInfo.city : '');
    const country = useField('text', currentInfo?.country ? currentInfo.country : '');
    const email = useField('text', currentInfo?.email ? currentInfo.email : '');
    const phone = useField('text', currentInfo?.phone ? currentInfo.phone : '');

    const required: UseField[] = [firstname, lastname, address, zipcode, city, country, email, phone];

    const validateField = (field: UseField, label: string): string | null => {
        if (required.includes(field) && field.value.toString().trim().length < 1) {
            return label + ' is required';
        } else if (field === email && !isValidEmailAddress(email.value.toString())) {
            return 'Invalid e-mail address';
        }
        return null;
    };

    useEffect(() => {
        const contact: Contact = {
            firstname: firstname.value.toString().trim(),
            lastname: lastname.value.toString().trim(),
            organization: organization.value.toString().trim(),
            address: address.value.toString().trim(),
            zipcode: zipcode.value.toString().trim(),
            city: city.value.toString().trim(),
            country: country.value.toString().trim(),
            email: email.value.toString().trim(),
            phone: phone.value.toString().trim(),
        };

        setCustomerInfo(contact);
    }, [firstname.value, lastname.value, organization.value, address.value, zipcode.value, city.value, country.value, email.value, phone.value]);

    const inputField = (label: string, field: UseField) => {
        const labelParts: string[] = label.includes('\n') ? label.split('\n') : [label];
        const error = validateField(field, label);

        return (
            <tr>
                <td className='widthByContent'>
                    {labelParts.length > 1 ? (
                        <>
                            {labelParts[0]}
                            <br />
                            <i>{labelParts[1]}</i>
                        </>
                    ) : (
                        <>{labelParts[0]}</>
                    )}
                </td>
                <td style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
                    {validate && error ? (
                        <div className='validationError'>
                            {error}
                            <br />
                        </div>
                    ) : (
                        <></>
                    )}
                    <input type={field.type} value={field.value} onChange={field.onChange} className={validate && error ? 'error' : ''} />
                </td>
            </tr>
        );
    };

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
                    {inputField('First name', firstname)}
                    {inputField('Last name', lastname)}
                    {inputField('Organization\n(optional)', organization)}
                    {inputField('Street address', address)}
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
