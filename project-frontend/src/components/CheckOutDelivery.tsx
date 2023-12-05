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
    width: string;
}

const CheckOutDelivery = ({ currentMethod, customerCountry, customerZipCode, setDeliveryMethod, validate, width }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [methods, setMethods] = useState<DeliveryMethod[]>([]);

    useEffect(() => {
        const isDomestic = () => {
            return config.store.contactCountry.names.find((name) => name.text === customerCountry);
        };

        if (customerCountry && customerCountry.length > 0) {
            setMethods(isDomestic() ? deliveryService.getAllDomestic() : deliveryService.getAllInternational());
        }
    }, [config.store.contactCountry, customerCountry]);

    return (
        <table className={'infoBox' + (validate && !currentMethod ? ' errors' : '')} width={width}>
            <tbody>
                <tr>
                    <td>
                        <table align='center' width='100%' className='paddingTopBottomOnly'>
                            <tbody>
                                <tr>
                                    <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                                        <div className='pageHeader' style={{ paddingTop: 0 }}>
                                            {contentToText(ContentID.checkOutChooseDeliveryMethod, config)}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table align='center' width='100%' className='paddingTopBottomOnly' style={{ paddingRight: '1rem' }}>
                            <tbody>
                                <tr>
                                    <td>
                                        {!customerCountry || customerCountry.length < 1 ? <div>Please select a country</div> : <></>}
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
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default CheckOutDelivery;
