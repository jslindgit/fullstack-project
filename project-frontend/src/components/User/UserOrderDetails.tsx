import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { DeliveryMethod, Order, ShoppingItem } from '../../types/orderTypes';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { getOrderStatus } from '../../types/orderTypeFunctions';
import { isString } from '../../types/typeFunctions';

import ShoppingCartContent from '../ShoppingCart/ShoppingCartContent';

interface Props {
    config: Config;
    order: Order;
}

const UserOrderDetails = ({ order, config }: Props) => {
    const deliveryMethod = isString(order.deliveryMethod) ? (JSON.parse(order.deliveryMethod) as DeliveryMethod) : order.deliveryMethod;
    const items = isString(order.items) ? (JSON.parse(order.items) as ShoppingItem[]) : order.items;

    if (deliveryMethod) {
        items.push({
            id: -1,
            name: langTextsToText(deliveryMethod.names, config),
            price: order.deliveryCost,
            quantity: 1,
            size: '',
        });
    }

    const parsedOrder = {
        ...order,
        deliveryMethod: deliveryMethod,
        items: items,
    };

    return (
        <div className='userOrderDetails'>
            <div className='semiBold sizeLarge'>
                {contentToText(ContentID.miscOrder, config)} {format.dateFormat(new Date(order.createdAt))}
            </div>
            <br />
            <div className='semiBold'>
                {contentToText(ContentID.orderId, config)}: {order.id}
            </div>
            <br />
            <div className='semiBold'>
                {contentToText(ContentID.orderStatus, config)}: <span className='bold'>{getOrderStatus(order.status, config)}</span>
            </div>
            <br />
            <ShoppingCartContent
                allowEdit={false}
                shoppingItems={parsedOrder.items}
                removeItem={null}
                totalSumContentID={ContentID.orderTotalAmount}
                width={'100%'}
            />
            <br />
            <div className='semiBold sizeLarge' style={{ marginBottom: '0.5rem' }}>
                {contentToText(ContentID.orderCustomer, config)}
            </div>
            <div className='normalWeight sizeSmallish'>
                {order.customerFirstName} {order.customerLastName}
                <br />
                {order.customerOrganization ? (
                    <>
                        {order.customerOrganization}
                        <br />
                    </>
                ) : (
                    <></>
                )}
                {order.customerAddress}
                <br />
                {order.customerZipCode} {order.customerCity}
                <br />
                {order.customerCountry}
                <br />
                {order.customerEmail}
                <br />
                {order.customerPhone}
            </div>
            <br />
            {deliveryMethod ? (
                <>
                    <div className='semiBold sizeLarge' style={{ marginBottom: '0.5rem' }}>
                        {contentToText(ContentID.orderDeliveryMethod, config)}
                    </div>
                    <div className='normalWeight'>
                        {langTextsToText(deliveryMethod.names, config)}
                        {deliveryMethod.notes.length > 0 ? (
                            <>
                                <br />
                                {deliveryMethod.notes}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
};

export default UserOrderDetails;
