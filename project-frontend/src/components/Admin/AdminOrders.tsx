import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';
import { NewNotification, NotificationTone } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import orderService from '../../services/orderService';
import { getOrderStatusForAdmin } from '../../types/orderTypeFunctions';
import useField from '../../hooks/useField';

import { setNotification } from '../../reducers/miscReducer';

import AdminOrderDetails from './AdminOrderDetails';
import AdminOrderRow from './AdminOrderRow';
import { Link } from '../CustomLink';
import InputField from '../InputField';
import SortArrow from '../SortArrow';

enum Folder {
    PROCESSING = 'processing',
    DELIVERED = 'delivered',
    RECYCLEBIN = 'recyclebin',
}

const AdminOrders = () => {
    type sortByOption = 'date' | 'customer' | 'totalSum' | 'delivery' | 'status';

    const [folder, setFolder] = useState<Folder>(Folder.PROCESSING);
    const [hoveredButton, setHoveredButton] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);
    const [sortBy, setSortBy] = useState<sortByOption>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [update, setUpdate] = useState<boolean>(false);

    const orderToOpen = useRef<Order | null>(null);

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [searchParams] = useSearchParams();

    const search = useField('text', ContentID.miscSearch);

    const setSorting = (by: sortByOption) => {
        if (sortBy !== by) {
            setSortBy(by);
        } else {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
    };

    const sortAndSet = (allOrders: Order[]) => {
        switch (sortBy) {
            case 'date':
                setOrders(
                    [...allOrders].sort((a, b) => (sortDirection === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)))
                );
                break;
            case 'customer':
                setOrders(
                    [...allOrders].sort((a, b) =>
                        sortDirection === 'asc'
                            ? (a.customerLastName + a.customerFirstName).localeCompare(b.customerLastName + b.customerFirstName)
                            : (b.customerLastName + b.customerFirstName).localeCompare(a.customerLastName + a.customerFirstName)
                    )
                );
                break;
            case 'totalSum':
                setOrders([...allOrders].sort((a, b) => (sortDirection === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount)));
                break;
            case 'delivery':
                setOrders(
                    [...allOrders].sort((a, b) =>
                        sortDirection === 'asc'
                            ? langTextsToText(a.deliveryMethod?.names, config).localeCompare(langTextsToText(b.deliveryMethod?.names, config))
                            : langTextsToText(b.deliveryMethod?.names, config).localeCompare(langTextsToText(a.deliveryMethod?.names, config))
                    )
                );
                break;
            case 'status':
                setOrders(
                    [...allOrders].sort((a, b) =>
                        sortDirection === 'asc'
                            ? getOrderStatusForAdmin(a, config).localeCompare(getOrderStatusForAdmin(b, config))
                            : getOrderStatusForAdmin(b, config).localeCompare(getOrderStatusForAdmin(a, config))
                    )
                );
                break;
            default:
                setOrders(allOrders);
                break;
        }
    };

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
        // prettier-ignore
        const dataToSort =
            search.stringValue().length > 0 ?
                data.filter((order) =>
                    order.customerFirstName.toLowerCase().includes(search.stringValue().toLowerCase()) ||
                    order.customerLastName.toLowerCase().includes(search.stringValue().toLowerCase()) ||
                    order.id.toString().includes(search.stringValue()))
                : data;

        sortAndSet(dataToSort.filter((order) => belongsToCurrentFolder(order)));
    };

    useEffect(() => {
        fetch();

        document.title = `${contentToText(ContentID.adminPanelHeader, config)} - ${contentToText(ContentID.adminPanelOrders, config)} (${orders.length})`;
    }, [config, folder, orders.length, search.value]);

    useEffect(() => {
        sortAndSet(orders);
    }, [sortBy, sortDirection]);

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
                <AdminOrderRow
                    key={order.id}
                    order={order}
                    isOpened={true}
                    handleClose={handleClose}
                    handleOpen={handleOpen}
                    hoveredButton={hoveredButton}
                    setHoveredButton={setHoveredButton}
                />
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
            <AdminOrderRow
                key={order.id}
                order={order}
                isOpened={false}
                handleClose={handleClose}
                handleOpen={handleOpen}
                hoveredButton={hoveredButton}
                setHoveredButton={setHoveredButton}
            />
        );
    };

    const columnHeader = (label: ContentID, sortByOption: sortByOption, widthByContent: boolean = false) => (
        <td className={widthByContent ? 'widthByContent' : ''} onClick={() => setSorting(sortByOption)}>
            <span
                className='clickable'
                title={contentToText(sortBy === sortByOption ? ContentID.miscClickToChangeSortingOrder : ContentID.miscClickToSortByThis, config)}
            >
                {contentToText(label, config)}
            </span>{' '}
            <SortArrow column={sortByOption} sortBy={sortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} config={config} />
        </td>
    );

    return (
        <div>
            <table align='center' width='100%' className='adminOrdersMenu' style={{ userSelect: 'none' }}>
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
            <br />
            <table width='100%' className='bgColorGrayExtremelyLight' style={{ border: '2px solid var(--colorGray)', borderRadius: '0.5rem' }}>
                <tbody>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(search.label, config)}:</td>
                        <td className='widthByContent'>
                            <InputField
                                useField={search}
                                width={'20rem'}
                                placeHolder={`${contentToText(ContentID.miscCustomers, config)} ${contentToText(
                                    ContentID.miscName,
                                    config
                                ).toLowerCase()} ${contentToText(ContentID.miscOr, config)} ${contentToText(ContentID.orderId, config).toLowerCase()}`}
                            />
                        </td>
                        <td className='alignLeft'>
                            <button type='button' onClick={() => search.setNewValue('')}>
                                {contentToText(ContentID.buttonClear, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table align='center' width='100%' className='adminOrders headerRow striped'>
                <tbody>
                    <tr>
                        {columnHeader(ContentID.miscDate, 'date')}
                        {columnHeader(ContentID.orderCustomer, 'customer')}
                        {columnHeader(ContentID.orderTotalAmount, 'totalSum')}
                        {columnHeader(ContentID.orderDeliveryMethod, 'delivery')}
                        {columnHeader(ContentID.orderStatus, 'status')}
                        <td width='1px'></td>
                    </tr>
                    {orders.length > 0 ? (
                        orders.map((order) => orderRow(order))
                    ) : (
                        <tr>
                            <td colSpan={6} className='alignCenter centered semiBold'>
                                <br />
                                {contentToText(ContentID.adminOrdersNoOrdersInFolder, config)} <span className='bold'>{folderLabel(folder)}</span>
                                {search.stringValue().length > 0 ? (
                                    <>
                                        {` ${contentToText(ContentID.miscWithSearchWords, config)} `}{' '}
                                        <span className='italic'>{`'${search.stringValue()}'`}</span>
                                    </>
                                ) : (
                                    ''
                                )}
                                .
                                <br />
                                <br />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br />
            <br />
        </div>
    );
};

export default AdminOrders;
