import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

interface Props {
    deleteOrder: (order: Order) => Promise<void>;
    handleMarkAsDelivered: (orderId: number) => Promise<void>;
    handlePrint: (orderId: number) => Promise<void>;
    order: Order;
}

const AdminOrderDetails = ({ deleteOrder, handleMarkAsDelivered, handlePrint, order }: Props) => {
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
                                <table width='100%' align='center' className='paddingTopBottomOnly sizeLarge' style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ paddingRight: '1rem', borderRadius: 0 }}>
                                                <img src='/printer_black.png' />
                                            </td>
                                            <td className='widthByContent' style={{ paddingBottom: '0.8rem', paddingLeft: 0, paddingRight: '1rem' }}>
                                                <a onClick={() => handlePrint(order.id)}>{contentToText(ContentID.adminOrdersPrintOrder, config)}</a>
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 0, borderRadius: 0 }}>
                                                {order.printedOutDate ? <img src='/checkmark_green.png' /> : <></>}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%' align='center' className='paddingTopBottomOnly sizeLarge' style={{ marginTop: 0, marginBottom: '1.25rem' }}>
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ borderRadius: 0, paddingTop: '0.8rem', paddingRight: '1rem' }}>
                                                <img src='/checkmark.png' />
                                            </td>
                                            <td className='widthByContent' style={{ paddingLeft: 0, paddingRight: 0 }}>
                                                <a onClick={() => handleMarkAsDelivered(order.id)}>
                                                    {contentToText(ContentID.adminOrdersMarkAsShipped, config)}
                                                </a>
                                            </td>
                                            <td style={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 0, borderRadius: 0 }}>
                                                {order.deliveredDate ? <img src='/checkmark_green.png' /> : <></>}
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
                                <span className='bold'>{contentToText(ContentID.orderStatusForAdminRead, config)}: </span>
                                <span className={'bold ' + (order.readDate ? 'colorGreen' : 'colorRed')}>
                                    {order.readDate ? format.dateFormat(new Date(order.readDate)) : contentToText(ContentID.miscNo, config)}
                                </span>
                                <br />
                                <span className='bold'>{contentToText(ContentID.adminOrdersPrintedOut, config)}: </span>
                                <span className={'bold ' + (order.printedOutDate ? 'colorGreen' : 'colorRed')}>
                                    {order.printedOutDate ? format.dateFormat(new Date(order.printedOutDate)) : contentToText(ContentID.miscNo, config)}
                                </span>
                                <br />
                                <span className='bold'>{contentToText(ContentID.adminOrdersShipped, config)}: </span>
                                <span className={'bold ' + (order.deliveredDate ? 'colorGreen' : 'colorRed')}>
                                    {order.deliveredDate ? format.dateFormat(new Date(order.deliveredDate)) : contentToText(ContentID.miscNo, config)}
                                </span>
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
                                            <td width='1px' style={{ borderRadius: 0, paddingRight: '1rem' }}>
                                                <img src='/trash.png' />
                                            </td>
                                            <td style={{ paddingBottom: '0.8rem', paddingLeft: 0 }}>
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
