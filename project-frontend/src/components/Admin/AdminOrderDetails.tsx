import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { langTextsToText } from '../../types/languageFunctions';

interface Props {
    order: Order;
    deleteOrder: (order: Order) => Promise<void>;
}

const AdminOrderDetails = ({ order, deleteOrder }: Props) => {
    const [copyLabel, setCopyLabel] = useState<string>('');
    const [copyResult, setCopyResult] = useState<string>('');

    const configState = useSelector((state: RootState) => state.config);

    const date = new Date(order.createdAt);

    const contactInfo = (label: string, value: string) => {
        const copyToClipboard = () => {
            navigator.clipboard
                .writeText(value)
                .then(() => {
                    setCopyResult(label + ' copied to clipboard');
                })
                .then(() => {
                    setCopyLabel(label);
                })
                .catch((_err) => {
                    setCopyResult('Failed to copy :(');
                    setCopyLabel(label);
                });
        };

        return (
            <>
                {label}:&ensp;
                <span className='bold'>
                    {value} &emsp;&emsp;{' '}
                    <button type='button' onClick={copyToClipboard} style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                        Copy {label}
                    </button>{' '}
                    <span className='italic normalWeight'>{copyLabel === label ? '\u2002' + copyResult : ''}</span>
                </span>
            </>
        );
    };

    return (
        <tr>
            <td colSpan={6} className='adminOrderDetailsRow'>
                <table align='center' width='100%' className='adminOrderDetails'>
                    <tbody>
                        <tr>
                            <td style={{ borderRadius: 0 }}>
                                <table width='100%' align='center' className='paddingTopBottomOnly sizeLarge' style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ paddingRight: '1rem', paddingTop: 0, paddingBottom: 0, borderRadius: 0 }}>
                                                <img src='/printer_black.png' />
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 4 }}>
                                                <a>Print order</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width='1px' style={{ paddingRight: '1rem', paddingBottom: 0 }}>
                                                <img src='/checkmark.png' />
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingBottom: 4 }}>
                                                <a>Mark as delivered</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className='bold'>Webstore order {format.dateFormat(date)}</span>
                                <br />
                                <br />
                                <span className='semiBold'>Order number: {order.id}</span>
                                <br />
                                <br />
                                ---
                                <br />
                                {order.items.map((item) => (
                                    <div key={item.id}>
                                        *<span className='semiBold'> {item.name}</span>
                                        <br />
                                        <span style={{ color: 'transparent' }}>*</span> {format.currency(item.price, configState)}/pcs &emsp; {item.quantity} pcs &emsp; Total:{' '}
                                        {format.currency(item.price * item.quantity, configState)}
                                        <br />
                                        <br />
                                    </div>
                                ))}
                                * Delivery cost: {format.currency(Number(order.deliveryCost), configState)}
                                <br />
                                <br />
                                Net: {format.currency((order.totalAmount / 100) * (100 - configState.vat), configState)}
                                <br />
                                VAT {configState.vat}%: {format.currency((order.totalAmount / 100) * configState.vat, configState)}
                                <br />
                                <br />
                                Total: {format.currency(order.totalAmount, configState)}
                                <br />
                                ---
                                <br />
                                <br />
                                <span className='semiBold'>CONTACT INFORMATION</span>
                                <br />
                                <br />
                                {contactInfo('Name', order.customerFirstName + ' ' + order.customerLastName)}
                                <br />
                                {contactInfo('Address', order.customerAddress)}
                                <br />
                                {contactInfo('Postal code', order.customerZipCode)}
                                <br />
                                {contactInfo('City', order.customerCity)}
                                <br />
                                {contactInfo('E-mail', order.customerEmail)}
                                <br />
                                {contactInfo('Phone', order.customerPhone)}
                                <br />
                                {contactInfo('Delivery method', order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, configState) : '-')}
                                <br />
                                <br />
                                <hr />
                                <br />
                                <span className='bold'>Printed out: </span>
                                <span className='colorRed bold'>No</span>
                                <br />
                                <span className='bold'>Delivered: </span>
                                <span className='colorRed bold'>No</span>
                                <br />
                                <br />
                                <table width='100%' align='center' className='paddingTopBottomOnly sizeLarge' style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ paddingRight: '1rem', paddingTop: 4, paddingBottom: 0 }}>
                                                <img src='/trash.png' />
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
                                                <a onClick={() => deleteOrder(order)}>Delete order</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

export default AdminOrderDetails;
