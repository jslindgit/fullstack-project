import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { DeliveryMethod } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import deliveryService from '../services/deliveryService';

import CheckOutDeliveryMethod from './CheckOutDeliveryMethod';

interface Props {
    currentMethod: DeliveryMethod | null;
    customerCountry: string | null;
    customerZipCode: string;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    validate: boolean;
}

const CheckOutDelivery = ({ currentMethod, customerCountry, customerZipCode, setDeliveryMethod, validate }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [methods, setMethods] = useState<DeliveryMethod[]>([]);

    useEffect(() => {
        const isDomestic = () => {
            return config.store.contactCountry.names.find((name) => name.text === customerCountry);
        };

        if (customerCountry && customerCountry.length > 0) {
            const suitableMethods = isDomestic() ? deliveryService.getAllDomestic() : deliveryService.getAllInternational();

            if (currentMethod && !suitableMethods.find((m) => m.code === currentMethod.code)) {
                setDeliveryMethod(null);
            }

            setMethods(suitableMethods);
        }
    }, [config.store.contactCountry, customerCountry]);

    return (
        <div className={'infoBox' + (validate && !currentMethod ? ' errors' : '')}>
            <div className='infoHeader'>{contentToText(ContentID.checkOutChooseDeliveryMethod, config)}</div>
            {!customerCountry || (customerCountry.length < 1 && <div>{contentToText(ContentID.checkOutSelectCountry, config)}</div>)}
            <div className='grid-container' data-gap='1.5rem'>
                {methods.map((m) => (
                    <CheckOutDeliveryMethod
                        key={m.code}
                        currentMethod={currentMethod}
                        customerZipCode={customerZipCode}
                        method={m}
                        setDeliveryMethod={setDeliveryMethod}
                    />
                ))}
                <a
                    onClick={() => {
                        setDeliveryMethod(null);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    Clear selection
                </a>
            </div>
        </div>
    );
};

export default CheckOutDelivery;
