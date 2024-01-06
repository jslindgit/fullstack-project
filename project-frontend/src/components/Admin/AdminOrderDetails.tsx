import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

interface Props {
    handleDelete: (order: Order) => Promise<void>;
    handleMarkAsDelivered: (order: Order) => Promise<void>;
    handleMarkAsNotDelivered: (order: Order) => Promise<void>;
    handleMoveBackFromRecycleBin: (order: Order) => Promise<void>;
    handleMoveToRecycleBin: (order: Order) => Promise<void>;
    handlePrint: (orderId: number) => Promise<void>;
    order: Order;
}

const AdminOrderDetails = ({
    handleDelete,
    handleMarkAsDelivered,
    handleMarkAsNotDelivered,
    handleMoveBackFromRecycleBin,
    handleMoveToRecycleBin,
    handlePrint,
    order,
}: Props) => {
    const [copyLabel, setCopyLabel] = useState<string>('');
    const [copyResult, setCopyResult] = useState<string>('');

    const config = useSelector((state: RootState) => state.config);

    const date = new Date(order.createdAt);

    const contactInfo = (label: string, value: string) => {
        const copyToClipboard = () => {
            navigator.clipboard
                .writeText(value)
                .then(() => {
                    setCopyResult(`${label} ${contentToText(ContentID.adminOrdersCopiedToClipboard, config)}`);
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
                                            <td width='1px' style={{ borderRadius: 0, paddingRight: '1rem' }}>
                                                <img src='/printer_black_2.png' height='20px' />
                                            </td>
                                            <td className='widthByContent' style={{ paddingBottom: '0.9rem', paddingLeft: 0, paddingRight: 0 }}>
                                                <a className='bold' onClick={() => handlePrint(order.id)}>
                                                    {contentToText(ContentID.adminOrdersPrintOrder, config)}
                                                </a>
                                            </td>
                                            <td style={{ borderRadius: 0, paddingBottom: '0.1rem', paddingLeft: '1rem', paddingTop: 0 }}>
                                                {order.printedOutDate ? <img src='/checkmark_green.png' /> : <></>}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%' align='center' className='paddingTopBottomOnly sizeLarge' style={{ marginTop: 0, marginBottom: '1.25rem' }}>
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ borderRadius: 0, paddingRight: '1rem', paddingTop: '0.3rem' }}>
                                                <img src={order.deliveredDate || order.recycledDate ? '/arrow_left.png' : '/checkmark.png'} height='20px' />
                                            </td>
                                            <td colSpan={2} className='widthByContent' style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}>
                                                {order.recycledDate ? (
                                                    <a className='bold' onClick={() => handleMoveBackFromRecycleBin(order)}>
                                                        {contentToText(ContentID.adminOrdersMoveBackFromRecycleBin, config)}
                                                    </a>
                                                ) : order.deliveredDate ? (
                                                    <a className='bold' onClick={() => handleMarkAsNotDelivered(order)}>
                                                        {contentToText(ContentID.adminOrdersMarkAsNotDelivered, config)}
                                                    </a>
                                                ) : (
                                                    <a className='bold' onClick={() => handleMarkAsDelivered(order)}>
                                                        {contentToText(ContentID.adminOrdersMarkAsDelivered, config)}
                                                    </a>
                                                )}
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
                                        •&nbsp;&nbsp;
                                        <span className='bold'>
                                            {item.name}
                                            {item.size && item.size.length > 0 ? (
                                                <>
                                                    <br />
                                                    <span style={{ color: 'transparent' }}>●&nbsp;&nbsp;</span>
                                                    <span className='sizeSmallish'>
                                                        {contentToText(ContentID.itemsSize, config)}: {item.size}
                                                    </span>
                                                </>
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                        <br />
                                        <span style={{ color: 'transparent' }}>•&nbsp;&nbsp;</span>
                                        {format.currency(item.price, config)}/{contentToText(ContentID.itemsPcs, config)} &emsp;{' '}
                                        <span className={item.quantity > 1 ? 'semiBold' : ''}>
                                            {item.quantity} {contentToText(ContentID.itemsPcs, config)} &emsp;
                                        </span>
                                        {contentToText(ContentID.cartTotalPrice, config)}: {format.currency(item.price * item.quantity, config)}
                                        <br />
                                        <br />
                                    </div>
                                ))}
                                •&nbsp;&nbsp;{contentToText(ContentID.orderDeliveryCost, config)}: {format.currency(Number(order.deliveryCost), config)}
                                <br />
                                <br />
                                {contentToText(ContentID.miscNet, config)}: {format.currency((order.totalAmount / 100) * (100 - config.vat), config)}
                                <br />
                                {contentToText(ContentID.miscVAT, config)} {config.vat}%: {format.currency((order.totalAmount / 100) * config.vat, config)}
                                <br />
                                <br />
                                <span className='semiBold'>
                                    {contentToText(ContentID.cartTotalPrice, config)}: {format.currency(order.totalAmount, config)}
                                </span>
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
                                <div className='lineHeight2'>
                                    <span className='semiBold'>{contentToText(ContentID.orderStatusForAdminRead, config)}: </span>
                                    <span className={'semiBold ' + (order.readDate ? 'colorGreen' : 'colorRed')}>
                                        {order.readDate ? format.dateFormat(new Date(order.readDate)) : contentToText(ContentID.miscNo, config)}
                                    </span>
                                    <br />
                                    <span className='semiBold'>{contentToText(ContentID.adminOrdersPrintedOut, config)}: </span>
                                    <span className={'semiBold ' + (order.printedOutDate ? 'colorGreen' : 'colorRed')}>
                                        {order.printedOutDate ? format.dateFormat(new Date(order.printedOutDate)) : contentToText(ContentID.miscNo, config)}
                                    </span>
                                    <br />
                                    <span className='semiBold'>{contentToText(ContentID.adminOrdersDeliveredDate, config)}: </span>
                                    <span className={'semiBold ' + (order.deliveredDate ? 'colorGreen' : 'colorRed')}>
                                        {order.deliveredDate ? format.dateFormat(new Date(order.deliveredDate)) : contentToText(ContentID.miscNo, config)}
                                    </span>
                                    {order.recycledDate ? (
                                        <>
                                            <br />
                                            <span className='semiBold'>{contentToText(ContentID.orderStatusForAdminRecycled, config)}: </span>
                                            <span className='semiBold colorRed'>{format.dateFormat(new Date(order.recycledDate))}</span>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <br />
                                <hr />
                                <table
                                    width='100%'
                                    align='center'
                                    className='paddingTopBottomOnly sizeLarge'
                                    style={{ marginTop: '1rem', marginBottom: '0.5rem' }}
                                >
                                    <tbody>
                                        <tr>
                                            <td width='1px' style={{ borderRadius: 0, paddingRight: '1rem' }}>
                                                <img src='/trash.png' height='20px' />
                                            </td>
                                            <td style={{ paddingBottom: '0.8rem', paddingLeft: 0 }}>
                                                {order.recycledDate ? (
                                                    <a className='bold red' onClick={() => handleDelete(order)}>
                                                        {contentToText(ContentID.adminOrdersDeleteOrderButton, config)}
                                                    </a>
                                                ) : (
                                                    <a className='bold red' onClick={() => handleMoveToRecycleBin(order)}>
                                                        {contentToText(ContentID.adminOrdersMoveToRecycleBin, config)}
                                                    </a>
                                                )}
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
