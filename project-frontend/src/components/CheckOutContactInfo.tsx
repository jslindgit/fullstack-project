import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useField, { UseField } from '../hooks/useField';

import { ContentID } from '../content';
import { NewOrder, Order } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import dev from '../util/dev';
import { isValidEmailAddress } from '../util/misc';
import { langTextsToText } from '../types/languageFunctions';

interface Props {
    currentOrder: NewOrder | Order;
    setCustomerInfo: (address: string, city: string, country: string, email: string, firstName: string, lastName: string, organization: string, phone: string, zipCode: string) => void;
    validate: boolean;
    width: string;
}

const CheckOutContactInfo = ({ currentOrder, setCustomerInfo, validate, width }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [availableCountries, setAvailableCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(currentOrder.customerCountry.length > 0 ? currentOrder.customerCountry : null);

    useEffect(() => {
        // In case the current country in the Order is set with a different language that is in use at the moment:
        const getCountryFromOrder = () => {
            config.store.deliveryCountries.forEach((c) => {
                if (c.names.find((langText) => langText.text === currentOrder.customerCountry)) {
                    setCountry(langTextsToText(c.names, config));
                }
            });
        };

        getCountryFromOrder();
    }, [config, config.language, currentOrder.customerCountry]);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountry(event.target.value);
    };

    const address = useField('text', currentOrder.customerAddress);
    const city = useField('text', currentOrder.customerCity);
    const email = useField('text', currentOrder.customerEmail);
    const firstName = useField('text', currentOrder.customerFirstName);
    const lastName = useField('text', currentOrder.customerLastName);
    const organization = useField('text', currentOrder.customerOrganization);
    const phone = useField('text', currentOrder.customerPhone);
    const zipCode = useField('text', currentOrder.customerZipCode);

    const required: UseField[] = [address, city, email, firstName, lastName, phone, zipCode];

    const fillRandomly = () => {
        const zipCity = dev.randomZipCodeAndCity();

        address.setNewValue(dev.randomStreetAddress());
        city.setNewValue(zipCity.city);
        setCountry('Suomi');
        email.setNewValue(dev.randomEmail());
        firstName.setNewValue(dev.randomFirstName());
        lastName.setNewValue(dev.randomLastName());
        organization.setNewValue(dev.randomOrganization());
        phone.setNewValue(dev.randomPhone());
        zipCode.setNewValue(zipCity.zip);
    };

    const validateField = (field: UseField, label: string): string | null => {
        if (required.includes(field) && field.value.toString().trim().length < 1) {
            return label + ' is required';
        } else if (field === email && !isValidEmailAddress(email.value.toString())) {
            return 'Invalid e-mail address';
        }
        return null;
    };

    useEffect(() => {
        const countries: string[] = [];
        config.store.deliveryCountries.forEach((c) => {
            countries.push(langTextsToText(c.names, config));
        });
        setAvailableCountries(countries);
    }, [config]);

    useEffect(() => {
        setCustomerInfo(
            address.value.toString().trim(),
            city.value.toString().trim(),
            country ? country : '',
            email.value.toString().trim(),
            firstName.value.toString().trim(),
            lastName.value.toString().trim(),
            organization.value.toString().trim(),
            phone.value.toString().trim(),
            zipCode.value.toString().trim()
        );
    }, [address.value, city.value, country, email.value, firstName.value, lastName.value, organization.value, phone.value, zipCode.value]);

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
                            <h3>{contentToText(ContentID.checkOutCustomerContactInformation, config)}</h3>
                            <a onClick={fillRandomly}>Fill randomly</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={width}>
                <tbody>
                    {inputField(contentToText(ContentID.checkOutFirstName, config), firstName)}
                    {inputField(contentToText(ContentID.checkOutLastName, config), lastName)}
                    {inputField(contentToText(ContentID.checkOutOrganization, config) + '\n(optional)', organization)}
                    {inputField(contentToText(ContentID.checkOutStreetAddress, config), address)}
                    {inputField(contentToText(ContentID.checkOutZipCode, config), zipCode)}
                    {inputField(contentToText(ContentID.checkOutCity, config), city)}

                    <tr>
                        <td className='widthByContent semiBold'>{contentToText(ContentID.checkOutCountry, config)}</td>
                        <td style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
                            {validate && !country ? (
                                <div className='validationError'>
                                    Country is required
                                    <br />
                                </div>
                            ) : (
                                <></>
                            )}
                            <select value={country || ''} onChange={handleCountryChange}>
                                <option value='' disabled>
                                    {contentToText(ContentID.checkOutSelectCountry, config)}
                                </option>
                                {availableCountries.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>

                    {inputField(contentToText(ContentID.contactEmail, config), email)}
                    {inputField(contentToText(ContentID.contactPhone, config), phone)}
                </tbody>
            </table>
        </>
    );
};

export default CheckOutContactInfo;
