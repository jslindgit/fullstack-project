import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DeliveryMethod } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import deliveryService from '../services/deliveryService';
import format from '../util/format';

interface Props {
    currentMethod: DeliveryMethod | null;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod) => void;
    width: string;
}

const CheckOutDelivery = ({ currentMethod, setDeliveryMethod, width }: Props) => {
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
                        <td>
                            <h3>Choose Delivery Method</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={width}>
                <tbody>
                    <tr>
                        <td>
                            {methods.map((m) => (
                                <div key={m.id} className={'deliveryMethod' + (selectedMethod && selectedMethod.id === m.id ? ' bold' : '')} onClick={() => setSelectedMethod(m)}>
                                    {m.name}
                                    <br />
                                    {m.description}
                                    <br />
                                    {format.currency(m.cost, configState)}
                                </div>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default CheckOutDelivery;
