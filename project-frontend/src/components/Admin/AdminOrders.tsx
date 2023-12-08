import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';
import { NewNotification, NotificationTone } from '../../types/types';

import { setNotification } from '../../reducers/miscReducer';

import { contentToText } from '../../types/languageFunctions';
import orderService from '../../services/orderService';

import AdminOrderDetails from './AdminOrderDetails';
import AdminOrderRow from './AdminOrderRow';
import { Link } from '../CustomLink';

enum Folder {
    PROCESSING = 'processing',
    DELIVERED = 'delivered',
    RECYCLEBIN = 'recyclebin',
}

const AdminOrders = () => {
    const [folder, setFolder] = useState<Folder>(Folder.PROCESSING);
    const [orders, setOrders] = useState<Order[]>([]);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);
    const [update, setUpdate] = useState<boolean>(false);

    const orderToOpen = useRef<Order | null>(null);

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const folderParam = searchParams.get('folder');
        if (
            folderParam &&
            Object.values(Folder)
                .map((f) => f.toString())
                .includes(folderParam)
        ) {
            setFolder(folderParam as Folder);
        }
    }, [searchParams]);

    const belongsToCurrentFolder = (order: Order): boolean => {
        switch (folder) {
            case Folder.PROCESSING:
                return !order.deliveredDate && !order.recycledDate;
            case Folder.DELIVERED:
                return order.deliveredDate !== undefined && order.deliveredDate !== null && !order.recycledDate;
            case Folder.RECYCLEBIN:
                return order.recycledDate !== undefined && order.recycledDate !== null;
        }
    };

    const fetch = async () => {
        const data = await orderService.getAll();
        setOrders(data.filter((order) => belongsToCurrentFolder(order)).sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    };

    useEffect(() => {
        fetch();

        document.title = `${contentToText(ContentID.adminPanelHeader, config)} - ${contentToText(ContentID.adminPanelOrders, config)} (${orders.length})`;
    }, [config, folder, orders.length]);

    useEffect(() => {
        setOpenedOrder(orderToOpen.current);
    }, [openedOrder, update]);

    const folderLabel = (folderName: Folder): string => {
        switch (folderName) {
            case Folder.PROCESSING:
                return contentToText(ContentID.adminOrdersProcessing, config);
            case Folder.DELIVERED:
                return contentToText(ContentID.adminOrdersDelivered, config);
            case Folder.RECYCLEBIN:
                return contentToText(ContentID.miscRecycleBin, config);
        }
    };

    const getNotification = (order: Order, folderName: Folder, tone: NotificationTone): NewNotification => {
        const message = `${contentToText(ContentID.miscOrder, config)} #${order.id} (${order.customerFirstName} ${order.customerLastName}) ${contentToText(
            ContentID.adminOrdersOrderWasMovedToFolder,
            config
        )} ${folderLabel(folderName)}.`;

        return { tone: tone, message: message, linkText: folderLabel(folderName), linkTo: `${window.location.pathname}?folder=${folderName}` };
    };

    const handleClose = () => {
        orderToOpen.current = null;
        setOpenedOrder(null);
    };

    const handleDelete = async (order: Order) => {
        if (
            usersState.loggedUser?.admin &&
            confirm(`${contentToText(ContentID.adminOrdersDeleteOrder, config)} ${order.id} (${order.customerFirstName} ${order.customerLastName})?`)
        ) {
            setOpenedOrder(null);
            const res = await orderService.deleteOrder(order, usersState.loggedUser?.token);
            await fetch();
            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));
        }
    };

    const handleMarkAsDelivered = async (order: Order) => {
        await orderService.update(order.id, { deliveredDate: new Date() });
        handleClose();
        await fetch();
        dispatch(setNotification(getNotification(order, Folder.DELIVERED, 'Positive')));
    };

    const handleMarkAsNotDelivered = async (order: Order) => {
        await orderService.update(order.id, { deliveredDate: null });
        handleClose();
        await fetch();
        dispatch(setNotification(getNotification(order, Folder.PROCESSING, 'Positive')));
    };

    const handleMoveBackFromRecycleBin = async (order: Order) => {
        await orderService.update(order.id, { recycledDate: null });
        handleClose();
        await fetch();
        dispatch(setNotification(getNotification(order, order.deliveredDate ? Folder.DELIVERED : Folder.PROCESSING, 'Positive')));
    };

    const handleMoveToRecycleBin = async (order: Order) => {
        await orderService.update(order.id, { recycledDate: new Date() });
        handleClose();
        await fetch();
        dispatch(setNotification(getNotification(order, Folder.RECYCLEBIN, 'Neutral')));
    };

    const handleOpen = async (order: Order) => {
        if (!order.readDate) {
            await orderService.update(order.id, { readDate: new Date() });
            await fetch();
        }

        orderToOpen.current = order;
        setOpenedOrder(order);
    };

    const handlePrint = async (orderId: number) => {
        console.log('print...'); // TODO: print the order

        await orderService.update(orderId, { printedOutDate: new Date() });
        await fetch();
        setUpdate(!update);
    };

    const menuItem = (folderName: Folder) => {
        if (folder === folderName) {
            return (
                <td width='33%' className='bold underlined thin'>
                    {folderLabel(folderName)}
                </td>
            );
        } else {
            return (
                <td width='33%'>
                    <Link to={`${window.location.pathname}?folder=${folderName}`}>{folderLabel(folderName)}</Link>
                </td>
            );
        }
    };

    const orderRow = (order: Order) => {
        return openedOrder?.id === order.id ? (
            <React.Fragment key={order.id}>
                <AdminOrderRow key={order.id} order={order} isOpened={true} handleClose={handleClose} handleOpen={handleOpen} />
                <AdminOrderDetails
                    order={order}
                    handleDelete={handleDelete}
                    handleMarkAsDelivered={handleMarkAsDelivered}
                    handleMarkAsNotDelivered={handleMarkAsNotDelivered}
                    handleMoveBackFromRecycleBin={handleMoveBackFromRecycleBin}
                    handleMoveToRecycleBin={handleMoveToRecycleBin}
                    handlePrint={handlePrint}
                />
            </React.Fragment>
        ) : (
            <AdminOrderRow key={order.id} order={order} isOpened={false} handleClose={handleClose} handleOpen={handleOpen} />
        );
    };

    return (
        <div>
            <table align='center' width='100%' className='adminOrdersMenu'>
                <tbody>
                    <tr>
                        {menuItem(Folder.PROCESSING)}
                        <td width='1px' className='colorGrayLight bold'>
                            |
                        </td>
                        {menuItem(Folder.DELIVERED)}
                        <td width='1px' className='colorGrayLight bold'>
                            |
                        </td>
                        {menuItem(Folder.RECYCLEBIN)}
                    </tr>
                </tbody>
            </table>
            <table align='center' width='100%' className='adminOrders striped'>
                <tbody>
                    <tr>
                        <td>{contentToText(ContentID.miscDate, config)}</td>
                        <td>{contentToText(ContentID.orderCustomer, config)}</td>
                        <td>{contentToText(ContentID.orderTotalAmount, config)}</td>
                        <td>{contentToText(ContentID.orderDeliveryMethod, config)}</td>
                        <td>{contentToText(ContentID.orderStatus, config)}</td>
                        <td width='1px'></td>
                    </tr>
                    {orders.length > 0 ? (
                        orders.map((order) => orderRow(order))
                    ) : (
                        <tr>
                            <td colSpan={6} className='alignCenter centered semiBold'>
                                <br />
                                {contentToText(ContentID.adminOrdersNoOrdersInFolder, config)} {folderLabel(folder)}.
                                <br />
                                <br />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;
