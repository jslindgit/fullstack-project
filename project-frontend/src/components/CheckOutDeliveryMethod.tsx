import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DeliveryMethod, DeliveryCode, PostiLocation } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { langTextsToText } from '../types/languageFunctions';
import postiService from '../services/postiService';
import useField from '../hooks/useField';

interface SelectProps {
    currentMethod: DeliveryMethod | null;
    customerZipCode: string;
    thisMethod: DeliveryMethod;
    selectedLocation: string;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
}
const PickupLocationSelection = ({ currentMethod, customerZipCode, thisMethod, selectedLocation, setDeliveryMethod, setSelectedLocation }: SelectProps) => {
    const [locations, setLocations] = useState<PostiLocation[]>([]);

    const zipCode = useField('text', customerZipCode);

    useEffect(() => {
        if (zipCode.value.toString().length > 4) {
            const fetch = async () => {
                const res = await postiService.getPickupPoints(zipCode.value.toString(), 30, 'fi');

                if (res.success) {
                    setLocations(res.locations);
                }
            };

            fetch();
        }
    }, [zipCode]);

    useEffect(() => {
        if (selectedLocation.length < 1 && locations.length > 0) {
            setSelectedLocation(locations[0].name);
        }
    }, [locations]);

    useEffect(() => {
        if (currentMethod?.code === thisMethod.code && selectedLocation.length > 0) {
            setDeliveryMethod({ ...thisMethod, notes: selectedLocation });
        }
    }, [currentMethod, selectedLocation]);

    useEffect(() => {
        if (customerZipCode.length > zipCode.value.toString().length) {
            zipCode.setNewValue(customerZipCode);
        }
    }, [customerZipCode]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocation(e.target.value);
    };

    return (
        <>
            <span className='semiBold'>Choose pickup location:</span>
            <br />
            <br />
            <input type={zipCode.type} value={zipCode.value} onChange={zipCode.onChange} style={{ width: '6rem' }} />
            <br />
            {locations.length > 0 ? (
                <>
                    <select value={selectedLocation} onChange={handleChange} style={{ marginTop: '1rem', width: '100%' }}>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.name + ' (' + loc.address + ')'}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                </>
            ) : zipCode.value.toString().length > 4 ? (
                <>Loading...</>
            ) : (
                <>Enter zipcode</>
            )}
        </>
    );
};

interface MethodProps {
    currentMethod: DeliveryMethod | null;
    customerZipCode: string;
    method: DeliveryMethod;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
}

const CheckOutDeliveryMethod = ({ currentMethod, customerZipCode, method, setDeliveryMethod }: MethodProps) => {
    const [selectedLocation, setSelectedLocation] = useState<string>(currentMethod && currentMethod.notes && currentMethod.notes.length > 0 ? currentMethod.notes : '');

    const configState = useSelector((state: RootState) => state.config);

    const handleClick = () => {
        method.code === DeliveryCode.POSTI_PAKETTI ? setDeliveryMethod({ ...method, notes: selectedLocation }) : setDeliveryMethod(method);
    };

    return (
        <table width='100%' className={'deliveryMethod' + (currentMethod && currentMethod.code === method.code ? ' deliveryMethodSelected' : '')} onClick={() => handleClick()}>
            <tbody>
                <tr>
                    <td>
                        <span className='sizeNormal bold'>{langTextsToText(method.names, configState)}</span>
                        {currentMethod?.code === method.code ? <span className='sizeNormal extraBold colorGreen'>&ensp;✔</span> : <></>}
                        <div className='sizeSmallish' style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                            {langTextsToText(method.descriptions, configState)}
                        </div>
                        <span className='semiBold'>{format.currency(method.cost, configState)}</span>
                        {method.code === DeliveryCode.POSTI_PAKETTI ? (
                            <div style={{ marginTop: '1rem' }}>
                                <PickupLocationSelection
                                    currentMethod={currentMethod}
                                    customerZipCode={customerZipCode}
                                    thisMethod={method}
                                    selectedLocation={selectedLocation}
                                    setDeliveryMethod={setDeliveryMethod}
                                    setSelectedLocation={setSelectedLocation}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default CheckOutDeliveryMethod;
