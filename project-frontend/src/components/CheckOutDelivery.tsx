import { useEffect, useState } from 'react';

import { DeliveryMethod } from '../types/orderTypes';

import deliveryService from '../services/deliveryService';

import CheckOutDeliveryMethod from './CheckOutDeliveryMethod';

interface Props {
    currentMethod: DeliveryMethod | null;
    customerZipCode: string;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    validate: boolean;
    width: string;
}

const CheckOutDelivery = ({ currentMethod, customerZipCode, setDeliveryMethod, validate, width }: Props) => {
    const [methods, setMethods] = useState<DeliveryMethod[]>([]);

    useEffect(() => {
        setMethods(deliveryService.getAll());
    }, []);

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
