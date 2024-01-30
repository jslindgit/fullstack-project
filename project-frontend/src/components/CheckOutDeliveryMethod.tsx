import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { DeliveryMethod, DeliveryCode, PostiLocation } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import postiService from '../services/postiService';
import useField from '../hooks/useField';

interface SelectProps {
    config: Config;
    currentMethod: DeliveryMethod | null;
    customerZipCode: string;
    thisMethod: DeliveryMethod;
    selectedLocation: string;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
}
const PickupLocationSelection = ({
    config,
    currentMethod,
    customerZipCode,
    thisMethod,
    selectedLocation,
    setDeliveryMethod,
    setSelectedLocation,
}: SelectProps) => {
    const [locations, setLocations] = useState<PostiLocation[]>([]);

    const zipCode = useField('text', ContentID.checkOutZipCode, customerZipCode);

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
        <div className='grid-container left' data-gap='1rem'>
            <div>{contentToText(ContentID.checkoutChoosePickupLocation, config)}:</div>
            <input type={zipCode.type} value={zipCode.value} onChange={zipCode.onChange} style={{ width: '6rem' }} />
            {locations.length > 0 ? (
                <select value={selectedLocation} onChange={handleChange}>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.name + ' (' + loc.address + ')'}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            ) : zipCode.value.toString().length > 4 ? (
                <>{contentToText(ContentID.miscLoading, config)}</>
            ) : (
                <>{contentToText(ContentID.checkOutEnterZipcode, config)}</>
            )}
        </div>
    );
};

interface MethodProps {
    currentMethod: DeliveryMethod | null;
    customerZipCode: string;
    method: DeliveryMethod;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
}

const CheckOutDeliveryMethod = ({ currentMethod, customerZipCode, method, setDeliveryMethod }: MethodProps) => {
    const [selectedLocation, setSelectedLocation] = useState<string>(
        currentMethod && currentMethod.notes && currentMethod.notes.length > 0 ? currentMethod.notes : ''
    );

    const config = useSelector((state: RootState) => state.config);

    const handleClick = () => {
        method.code === DeliveryCode.POSTI_PAKETTI ? setDeliveryMethod({ ...method, notes: selectedLocation }) : setDeliveryMethod(method);
    };

    return (
        <div
            className={'alignLeft deliveryMethod' + (currentMethod && currentMethod.code === method.code ? ' deliveryMethodSelected' : '')}
            onClick={() => handleClick()}
        >
            <span className='sizeNormal bold'>{langTextsToText(method.names, config)}</span>
            {currentMethod?.code === method.code ? <span className='sizeNormal extraBold colorGreen'>&ensp;✔</span> : <></>}
            <div className='sizeSmallish' style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                {langTextsToText(method.descriptions, config)}
            </div>
            <span className='semiBold'>{format.currency(method.cost, config)}</span>
            {method.code === DeliveryCode.POSTI_PAKETTI && (
                <div style={{ marginTop: '1rem' }}>
                    <PickupLocationSelection
                        config={config}
                        currentMethod={currentMethod}
                        customerZipCode={customerZipCode}
                        thisMethod={method}
                        selectedLocation={selectedLocation}
                        setDeliveryMethod={setDeliveryMethod}
                        setSelectedLocation={setSelectedLocation}
                    />
                </div>
            )}
        </div>
    );
};

export default CheckOutDeliveryMethod;
