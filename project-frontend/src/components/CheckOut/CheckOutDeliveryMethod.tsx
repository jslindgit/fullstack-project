import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { DeliveryMethod, DeliveryCode, PostiLocation } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import postiService from '../../services/postiService';
import useField from '../../hooks/useField';

interface SelectProps {
    config: Config;
    currentMethodCode: DeliveryCode | null;
    customerZipCode: string;
    thisMethod: DeliveryMethod;
    selectedPoint: string;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    setSelectedPoint: React.Dispatch<React.SetStateAction<string>>;
}
const PickupPointSelection = ({ config, currentMethodCode, customerZipCode, thisMethod, selectedPoint, setDeliveryMethod, setSelectedPoint }: SelectProps) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [locations, setLocations] = useState<PostiLocation[]>([]);

    const zipCode = useField('text', ContentID.checkOutZipCode, customerZipCode);

    // Fetch pickup points from Posti's API:
    useEffect(() => {
        if (zipCode.value.toString().length > 4) {
            const fetch = async () => {
                const res = await postiService.getPickupPoints(zipCode.value.toString(), 30, 'fi');

                if (res.success) {
                    setLocations(res.locations);
                    setLoaded(true);
                }
            };

            fetch();
        }
    }, [zipCode]);

    // By default, select the first possible pickup point:
    useEffect(() => {
        if (selectedPoint.length < 1 && locations.length > 0) {
            setSelectedPoint(locations[0].name);
        }
    }, [locations, selectedPoint.length, setSelectedPoint]);

    useEffect(() => {
        if (currentMethodCode && currentMethodCode === thisMethod.code && selectedPoint.length > 0) {
            setDeliveryMethod({ ...thisMethod, notes: selectedPoint });
        }
    }, [currentMethodCode, selectedPoint, setDeliveryMethod, thisMethod]);

    useEffect(() => {
        if (customerZipCode.length > zipCode.value.toString().length) {
            zipCode.setNewValue(customerZipCode);
        }
    }, [customerZipCode, zipCode]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPoint(e.target.value);
    };

    return (
        <div className='grid-container left' data-gap='1rem'>
            <div className='semiBold'>{contentToText(ContentID.checkoutChoosePickupLocation, config)}:</div>
            <input className='checkOutInput width6rem' type={zipCode.type} value={zipCode.value} onChange={zipCode.onChange} />
            {locations.length > 0 ? (
                <select className='checkOutSelect' value={selectedPoint} onChange={handleChange}>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.name + ' (' + loc.address + ')'}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            ) : zipCode.value.toString().length > 4 ? (
                <>{contentToText(loaded ? ContentID.checkOutNoPickupPointsWithThisZipcode : ContentID.miscLoading, config)}</>
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
    testId?: string;
}

const CheckOutDeliveryMethod = ({ currentMethod, customerZipCode, method, setDeliveryMethod, testId = '' }: MethodProps) => {
    const [selectedPoint, setSelectedPoint] = useState<string>(
        currentMethod && currentMethod.notes && currentMethod.notes.length > 0 ? currentMethod.notes : ''
    );

    const config = useSelector((state: RootState) => state.config);

    const handleClick = () => {
        method.code === DeliveryCode.POSTI_PAKETTI ? setDeliveryMethod({ ...method, notes: selectedPoint }) : setDeliveryMethod(method);
    };

    return (
        <div
            data-testid={testId}
            className={'alignLeft deliveryMethod' + (currentMethod && currentMethod.code === method.code ? ' deliveryMethodSelected' : '')}
            onClick={() => handleClick()}
        >
            <span className='bold preLine sizeNormal'>{langTextsToText(method.names, config)}</span>
            {currentMethod?.code === method.code ? <span className='sizeNormal extraBold colorGreen'>&ensp;✔</span> : <></>}
            <div className='marginBottom0_5 marginTop0_5 sizeSmallish'>{langTextsToText(method.descriptions, config)}</div>
            <span className='bold sizeNormal'>{format.currency(method.cost, config)}</span>
            {method.code === DeliveryCode.POSTI_PAKETTI && (
                <div className='marginTop1'>
                    <PickupPointSelection
                        config={config}
                        currentMethodCode={currentMethod ? currentMethod.code : null}
                        customerZipCode={customerZipCode}
                        thisMethod={method}
                        selectedPoint={selectedPoint}
                        setDeliveryMethod={setDeliveryMethod}
                        setSelectedPoint={setSelectedPoint}
                    />
                </div>
            )}
        </div>
    );
};

export default CheckOutDeliveryMethod;
