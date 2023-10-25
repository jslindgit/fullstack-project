import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import deliveryService from '../services/deliveryService';
import format from '../util/format';

interface Props {
    width: number;
}

const CheckOutDelivery = ({ width }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    const methods = deliveryService.getAll();

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
                                <div key={m.id}>
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
