import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DeliveryMethod } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import deliveryService from '../services/deliveryService';

import CheckOutDeliveryMethod from './CheckOutDeliveryMethod';

interface Props {
    currentMethod: DeliveryMethod | null;
    customerCountry: string | null;
    customerZipCode: string;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    validate: boolean;
    width: string;
}

const CheckOutDelivery = ({ currentMethod, customerCountry, customerZipCode, setDeliveryMethod, validate, width }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    const [methods, setMethods] = useState<DeliveryMethod[]>([]);

    useEffect(() => {
        const isDomestic = () => {
            return configState.store.contactCountry.names.find((name) => name.text === customerCountry);
        };

        if (customerCountry && customerCountry.length > 0) {
            setMethods(isDomestic() ? deliveryService.getAllDomestic() : deliveryService.getAllInternational());
        }
    }, [configState.store.contactCountry, customerCountry]);

    return (
        <>
            <table align='center' width={width} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <h3>Choose Delivery Method</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={width} style={{ outline: validate && !currentMethod ? '3px solid red' : '0' }}>
                <tbody>
                    <tr>
                        <td>
                            {!customerCountry || customerCountry.length < 1 ? <div>Please select a country</div> : <></>}
                            {methods.map((m) => (
                                <CheckOutDeliveryMethod key={m.code} currentMethod={currentMethod} customerZipCode={customerZipCode} method={m} setDeliveryMethod={setDeliveryMethod} />
                            ))}
                            <a
                                onClick={() => {
                                    setDeliveryMethod(null);
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                Clear selection
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default CheckOutDelivery;
