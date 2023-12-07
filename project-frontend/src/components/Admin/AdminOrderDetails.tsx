import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

interface Props {
    order: Order;
    deleteOrder: (order: Order) => Promise<void>;
}

const AdminOrderDetails = ({ order, deleteOrder }: Props) => {
    const [copyLabel, setCopyLabel] = useState<string>('');
    const [copyResult, setCopyResult] = useState<string>('');

    const config = useSelector((state: RootState) => state.config);

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
                        {contentToText(ContentID.miscCopy, config)} {label}
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
                                <table
                                    width='100%'
                                    align='center'
                                    className='paddingTopBottomOnly sizeLarge'
                                    style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}
                                >
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ paddingRight: '1rem', paddingTop: 0, paddingBottom: 0, borderRadius: 0 }}>
                                                <img src='/printer_black.png' />
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 4 }}>
                                                <a>{contentToText(ContentID.adminOrdersPrintOrder, config)}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width='1px' style={{ paddingRight: '1rem', paddingBottom: 0 }}>
                                                <img src='/checkmark.png' />
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingBottom: 4 }}>
                                                <a>{contentToText(ContentID.adminOrdersMarkAsShipped, config)}</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className='bold'>
                                    {config.store.contactName} {contentToText(ContentID.miscOrder, config).toLowerCase()} {format.dateFormat(date)}
                                </span>
                                <br />
                                <br />
                                <span className='semiBold'>
                                    {contentToText(ContentID.orderId, config)}: {order.id}
                                </span>
                                <br />
                                <br />
                                ---
                                <br />
                                {order.items.map((item) => (
                                    <div key={item.id}>
                                        *<span className='semiBold'> {item.name}</span>
                                        <br />
                                        <span style={{ color: 'transparent' }}>*</span> {format.currency(item.price, config)}/
                                        {contentToText(ContentID.itemsPcs, config)} &emsp; {item.quantity} {contentToText(ContentID.itemsPcs, config)} &emsp;
                                        {contentToText(ContentID.cartTotalPrice, config)}: {format.currency(item.price * item.quantity, config)}
                                        <br />
                                        <br />
                                    </div>
                                ))}
                                * {contentToText(ContentID.orderDeliveryCost, config)}: {format.currency(Number(order.deliveryCost), config)}
                                <br />
                                <br />
                                {contentToText(ContentID.miscNet, config)}: {format.currency((order.totalAmount / 100) * (100 - config.vat), config)}
                                <br />
                                {contentToText(ContentID.miscVAT, config)} {config.vat}%: {format.currency((order.totalAmount / 100) * config.vat, config)}
                                <br />
                                <br />
                                {contentToText(ContentID.cartTotalPrice, config)}: {format.currency(order.totalAmount, config)}
                                <br />
                                ---
                                <br />
                                <br />
                                <span className='semiBold'>{contentToText(ContentID.accountContactInfo, config).toUpperCase()}</span>
                                <br />
                                <br />
                                {contactInfo(contentToText(ContentID.miscName, config), order.customerFirstName + ' ' + order.customerLastName)}
                                <br />
                                {contactInfo(contentToText(ContentID.checkOutStreetAddress, config), order.customerAddress)}
                                <br />
                                {contactInfo(contentToText(ContentID.checkOutZipCode, config), order.customerZipCode)}
                                <br />
                                {contactInfo(contentToText(ContentID.checkOutCity, config), order.customerCity)}
                                <br />
                                {contactInfo(contentToText(ContentID.contactEmail, config), order.customerEmail)}
                                <br />
                                {contactInfo(contentToText(ContentID.contactPhone, config), order.customerPhone)}
                                <br />
                                {contactInfo(
                                    contentToText(ContentID.orderDeliveryMethod, config),
                                    order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, config) : '-'
                                )}
                                <br />
                                <br />
                                <hr />
                                <br />
                                <span className='bold'>{contentToText(ContentID.adminOrdersPrintedOut, config)}: </span>
                                <span className='colorRed bold'>{contentToText(ContentID.miscNo, config)}</span>
                                <br />
                                <span className='bold'>{contentToText(ContentID.adminOrdersShipped, config)}: </span>
                                <span className='colorRed bold'>{contentToText(ContentID.miscNo, config)}</span>
                                <br />
                                <br />
                                <table
                                    width='100%'
                                    align='center'
                                    className='paddingTopBottomOnly sizeLarge'
                                    style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}
                                >
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ paddingRight: '1rem', paddingTop: 4, paddingBottom: 0 }}>
                                                <img src='/trash.png' />
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
                                                <a onClick={() => deleteOrder(order)}>{contentToText(ContentID.adminOrdersMoveToRecycleBin, config)}</a>
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
