import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { DeliveryMethod, NewOrder, Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import { orderFitsInLetter } from '../../util/checkoutProvider';
import deliveryService from '../../services/deliveryService';
import { contentToText } from '../../types/languageFunctions';

import CheckOutDeliveryMethod from './CheckOutDeliveryMethod';

interface Props {
    currentMethod: DeliveryMethod | null;
    customerCountry: string | null;
    customerZipCode: string;
    order: NewOrder | Order;
    setDeliveryMethod: (deliveryMethod: DeliveryMethod | null) => void;
    validate: boolean;
}

const CheckOutDelivery = ({ currentMethod, customerCountry, customerZipCode, order, setDeliveryMethod, validate }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [methods, setMethods] = useState<DeliveryMethod[]>([]);

    useEffect(() => {
        const isDomestic = () => {
            return config.store.contactCountry.names.find((name) => name.text === customerCountry);
        };

        const setSuitableMethods = async () => {
            if (customerCountry && customerCountry.length > 0) {
                const availableMethods = isDomestic() ? deliveryService.getAllDomestic() : deliveryService.getAllInternational();

                const suitableMethods = (await orderFitsInLetter(order)) ? availableMethods : [...availableMethods].filter((m) => !m.isLetter);

                if (currentMethod && !suitableMethods.find((m) => m.code === currentMethod.code)) {
                    setDeliveryMethod(null);
                }

                setMethods(suitableMethods);
            }
        };

        setSuitableMethods();
    }, [config.store.contactCountry, currentMethod, customerCountry, order, setDeliveryMethod]);

    return (
        <div className={'infoBox' + (validate && !currentMethod ? ' errors' : '')}>
            <div data-testid='checkout-delivery-header' className='infoHeader'>
                {contentToText(ContentID.checkOutChooseDeliveryMethod, config)}
            </div>
            {(!customerCountry || customerCountry.length < 1) && <div className='alignLeft'>{contentToText(ContentID.checkOutSelectCountry, config)}</div>}
            <div className='grid-container' data-gap='1.5rem'>
                {methods.map((m) => (
                    <CheckOutDeliveryMethod
                        key={m.code}
                        currentMethod={currentMethod}
                        customerZipCode={customerZipCode}
                        method={m}
                        setDeliveryMethod={setDeliveryMethod}
                        testId={methods.indexOf(m) === methods.length - 1 ? 'checkout-delivery-last-method' : ''}
                    />
                ))}
            </div>
        </div>
    );
};

export default CheckOutDelivery;
