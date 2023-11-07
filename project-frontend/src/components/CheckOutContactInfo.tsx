import { useEffect } from 'react';
import useField, { UseField } from '../hooks/useField';

import { NewOrder, Order } from '../types/orderTypes';

import { isValidEmailAddress } from '../util/misc';

interface Props {
    currentOrder: NewOrder | Order;
    setCustomerInfo: (address: string, city: string, country: string, email: string, firstName: string, lastName: string, organization: string, phone: string, zipCode: string) => void;
    validate: boolean;
    width: string;
}

const CheckOutContactInfo = ({ currentOrder, setCustomerInfo, validate, width }: Props) => {
    const address = useField('text', currentOrder.customerAddress);
    const city = useField('text', currentOrder.customerCity);
    const country = useField('text', currentOrder.customerCountry);
    const email = useField('text', currentOrder.customerEmail);
    const firstName = useField('text', currentOrder.customerFirstName);
    const lastName = useField('text', currentOrder.customerLastName);
    const organization = useField('text', currentOrder.customerOrganization);
    const phone = useField('text', currentOrder.customerPhone);
    const zipCode = useField('text', currentOrder.customerZipCode);

    const required: UseField[] = [address, city, country, email, firstName, lastName, phone, zipCode];

    const validateField = (field: UseField, label: string): string | null => {
        if (required.includes(field) && field.value.toString().trim().length < 1) {
            return label + ' is required';
        } else if (field === email && !isValidEmailAddress(email.value.toString())) {
            return 'Invalid e-mail address';
        }
        return null;
    };

    useEffect(() => {
        setCustomerInfo(
            address.value.toString().trim(),
            city.value.toString().trim(),
            country.value.toString().trim(),
            email.value.toString().trim(),
            firstName.value.toString().trim(),
            lastName.value.toString().trim(),
            organization.value.toString().trim(),
            phone.value.toString().trim(),
            zipCode.value.toString().trim()
        );
    }, [address.value, city.value, country.value, email.value, firstName.value, lastName.value, organization.value, phone.value, zipCode.value]);

    const inputField = (label: string, field: UseField) => {
        const labelParts: string[] = label.includes('\n') ? label.split('\n') : [label];
        const error = validateField(field, label);

        return (
            <tr>
                <td className={'widthByContent' + (required.includes(field) ? ' semiBold' : '')}>
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
                    {inputField('First name', firstName)}
                    {inputField('Last name', lastName)}
                    {inputField('Organization\n(optional)', organization)}
                    {inputField('Street address', address)}
                    {inputField('Zipcode', zipCode)}
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
