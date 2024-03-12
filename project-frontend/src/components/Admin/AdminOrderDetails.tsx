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
    order: Order;
}

const AdminOrderDetails = ({
    handleDelete,
    handleMarkAsDelivered,
    handleMarkAsNotDelivered,
    handleMoveBackFromRecycleBin,
    handleMoveToRecycleBin,
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
            <div className='grid-container valignMiddle' data-cols='auto auto 1fr' data-gap='1rem'>
                <div>{label}:</div>
                <div className='bold'>{value}&emsp;</div>
                <div>
                    <button type='button' className='marginBottom0_5 marginTop0_5' onClick={copyToClipboard}>
                        {contentToText(ContentID.miscCopy, config)} {label}
                    </button>{' '}
                    <span className='italic normalWeight'>{copyLabel === label ? '\u2002' + copyResult : ''}</span>
                </div>
            </div>
        );
    };

    return (
        <tr>
            <td colSpan={6} className='adminOrderDetailsRow'>
                <div className='adminOrderDetailsDiv grid-container' data-gap='1rem'>
                    <div className='bold grid-container left sizeLarge valignMiddle' data-cols='auto 1fr' data-gap='1rem'>
                        <img src={order.deliveredDate || order.recycledDate ? '/arrow_left.png' : '/checkmark.png'} height='20px' />
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
                    </div>
                    <div>
                        <hr />
                    </div>
                    <div className='bold'>
                        {config.store.contactName} {contentToText(ContentID.miscOrder, config).toLowerCase()} {format.dateFormat(date)}
                    </div>
                    <div className='semiBold'>
                        {contentToText(ContentID.orderId, config)}: {order.id}
                    </div>
                    <div>
                        ---
                        <br />
                        {order.items.map((item) => (
                            <div key={item.id.toString() + item.size}>
                                •&nbsp;&nbsp;
                                <span className='bold'>
                                    {item.name}
                                    {item.size && item.size.length > 0 ? (
                                        <>
                                            <br />
                                            <span className='colorTransparent'>●&nbsp;&nbsp;</span>
                                            <span className='sizeSmallish'>
                                                {contentToText(ContentID.itemsSize, config)}: {item.size}
                                            </span>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </span>
                                <br />
                                <span className='colorTransparent'>•&nbsp;&nbsp;</span>
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
                        <span className='bold'>
                            {contentToText(ContentID.cartTotalPrice, config)}: {format.currency(order.totalAmount, config)}
                        </span>
                        <br />
                        ---
                    </div>
                    <div>
                        <div className='semiBold'>{contentToText(ContentID.accountContactInfo, config).toUpperCase()}</div>
                        {contactInfo(contentToText(ContentID.miscName, config), order.customerFirstName + ' ' + order.customerLastName)}
                        {contactInfo(contentToText(ContentID.checkOutStreetAddress, config), order.customerAddress)}
                        {contactInfo(contentToText(ContentID.checkOutZipCode, config), order.customerZipCode)}
                        {contactInfo(contentToText(ContentID.checkOutCity, config), order.customerCity)}
                        {contactInfo(contentToText(ContentID.contactEmail, config), order.customerEmail)}
                        {contactInfo(contentToText(ContentID.contactPhone, config), order.customerPhone)}
                        {contactInfo(
                            contentToText(ContentID.orderDeliveryMethod, config),
                            order.deliveryMethod
                                ? langTextsToText(order.deliveryMethod.names, config) +
                                      (order.deliveryMethod.notes.length > 0 ? ` (${order.deliveryMethod.notes})` : '')
                                : '-'
                        )}
                    </div>
                    <div>
                        <hr />
                    </div>
                    <div className='grid-container semiBold' data-gap='0.5rem'>
                        <div>
                            {contentToText(ContentID.orderStatusForAdminRead, config)}:{' '}
                            <span className={order.readDate ? 'colorGreen' : 'colorRed'}>
                                {order.readDate ? format.dateFormat(new Date(order.readDate)) : contentToText(ContentID.miscNo, config)}
                            </span>
                        </div>
                        <div>
                            {contentToText(ContentID.adminOrdersPrintedOut, config)}:{' '}
                            <span className={order.printedOutDate ? 'colorGreen' : 'colorRed'}>
                                {order.printedOutDate ? format.dateFormat(new Date(order.printedOutDate)) : contentToText(ContentID.miscNo, config)}
                            </span>
                        </div>
                        <div>
                            {contentToText(ContentID.adminOrdersDeliveredDate, config)}:{' '}
                            <span className={order.deliveredDate ? 'colorGreen' : 'colorRed'}>
                                {order.deliveredDate ? format.dateFormat(new Date(order.deliveredDate)) : contentToText(ContentID.miscNo, config)}
                            </span>
                        </div>
                        {order.recycledDate && (
                            <div>
                                {contentToText(ContentID.orderStatusForAdminRecycled, config)}:{' '}
                                <span className='colorRed'>{format.dateFormat(new Date(order.recycledDate))}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <hr />
                    </div>
                    <div className='bold grid-container left marginBottom0_25 sizeLarge valignMiddle' data-cols='auto 1fr' data-gap='1rem'>
                        <img src='/trash.png' height='20px' />
                        {order.recycledDate ? (
                            <a className='bold red' onClick={() => handleDelete(order)}>
                                {contentToText(ContentID.adminOrdersDeleteOrderButton, config)}
                            </a>
                        ) : (
                            <a className='bold red' onClick={() => handleMoveToRecycleBin(order)}>
                                {contentToText(ContentID.adminOrdersMoveToRecycleBin, config)}
                            </a>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default AdminOrderDetails;
