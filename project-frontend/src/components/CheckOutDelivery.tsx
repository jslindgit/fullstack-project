import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DeliveryMethod } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import deliveryService from '../services/deliveryService';
import format from '../util/format';

interface Props {
    currentMethod: DeliveryMethod | null;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    validate: boolean;
    width: string;
}

const CheckOutDelivery = ({ currentMethod, setDeliveryMethod, validate, width }: Props) => {
    interface MethodProps {
        m: DeliveryMethod;
    }
    const Method = ({ m }: MethodProps) => (
        <table width='100%' className={'deliveryMethod' + (selectedMethod && selectedMethod.id === m.id ? ' deliveryMethodSelected' : '')} onClick={() => setSelectedMethod(m)}>
            <tbody>
                <tr>
                    <td>
                        <span className='sizeNormal bold'>{m.name}</span>
                        {selectedMethod?.id === m.id ? <span className='sizeNormal extraBold colorGreen'>&ensp;✔</span> : <></>}
                        <br />
                        <span className='sizeSmallish'>{m.description}</span>
                        <br />
                        {format.currency(m.cost, configState)}
                    </td>
                </tr>
            </tbody>
        </table>
    );

    const configState = useSelector((state: RootState) => state.config);

    const [methods, setMethods] = useState<DeliveryMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod | null>(currentMethod);

    useEffect(() => {
        setMethods(deliveryService.getAll());
    }, []);

    useEffect(() => {
        if (selectedMethod) {
            setDeliveryMethod(selectedMethod);
        }
    }, [selectedMethod]);

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
            <table align='center' width={width} style={{ outline: validate && !selectedMethod ? '3px solid red' : '0' }}>
                <tbody>
                    <tr>
                        <td>
                            {methods.map((m) => (
                                <Method key={m.id} m={m} />
                            ))}
                            <a
                                onClick={() => {
                                    setSelectedMethod(null);
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
