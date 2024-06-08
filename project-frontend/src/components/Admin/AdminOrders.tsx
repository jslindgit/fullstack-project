import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { Order, OrderResponse, OrderStatus } from '../../types/orderTypes';
import { RootState } from '../../redux/rootReducer';
import { NewNotification, NotificationTone } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { getOrderStatusForAdmin } from '../../util/orderProvider';
import useField from '../../hooks/useField';

import { setNotification } from '../../redux/miscReducer';
import { useOrderDeleteMutation, useOrderGetAllQuery, useOrderUpdateMutation } from '../../redux/orderSlice';

import AdminOrderDetails from './AdminOrderDetails';
import AdminOrderGridRow from './AdminOrderGridRow';
import { Link } from '../CustomLink';
import InputField from '../InputField';
import LoadingQuery from '../LoadingQuery';
import SortArrow from '../SortArrow';

enum Folder {
    PROCESSING = 'processing',
    DELIVERED = 'delivered',
    RECYCLEBIN = 'recyclebin',
}

const AdminOrders = () => {
    const [orderDelete] = useOrderDeleteMutation();
    const orderGetAll = useOrderGetAllQuery();
    const [orderUpdate] = useOrderUpdateMutation();

    type sortByOption = 'date' | 'customer' | 'totalSum' | 'delivery' | 'status';

    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [currentFolder, setCurrentFolder] = useState<Folder>(Folder.PROCESSING);
    const [orders, setOrders] = useState<Order[]>([]);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);
    const [sortBy, setSortBy] = useState<sortByOption>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

    const updateOrder = async (orderId: number, propsToUpdate: object): Promise<OrderResponse> => {
        return await orderUpdate({ orderId: orderId, propsToUpdate: propsToUpdate, config: config }).unwrap();
    };

    // Set current folder according to URL parameter:
    useEffect(() => {
        const folderParam = searchParams.get('folder');
        if (
            folderParam &&
            Object.values(Folder)
                .map((f) => f.toString())
                .includes(folderParam)
        ) {
            setCurrentFolder(folderParam as Folder);
        }
    }, [searchParams]);

    const belongsToFolder = (order: Order, folder: Folder): boolean => {
        switch (folder) {
            case Folder.PROCESSING:
                return !order.deliveredDate && !order.recycledDate;
            case Folder.DELIVERED:
                return order.deliveredDate !== undefined && order.deliveredDate !== null && !order.recycledDate;
            case Folder.RECYCLEBIN:
                return order.recycledDate !== undefined && order.recycledDate !== null;
        }
    };

    // Page title:
    useEffect(() => {
        document.title = `${contentToText(ContentID.adminPanelHeader, config)} - ${contentToText(ContentID.adminPanelOrders, config)} (${orders.length})`;
    }, [config, orders.length]);

    // Fetch Orders from server:
    useEffect(() => {
        if (orderGetAll.data) {
            setAllOrders(orderGetAll.data.filter((order) => order.status !== OrderStatus.PENDING));
        }
    }, [orderGetAll.data]);

    // Sort and filter (if search is being used) the Orders:
    useEffect(() => {
        const sortAndSet = (allOrders: Order[]) => {
            switch (sortBy) {
                case 'date':
                    setOrders(
                        [...allOrders].sort((a, b) =>
                            sortDirection === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)
                        )
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

        // prettier-ignore
        const dataToSort =
            search.value.toString().length > 0
                ? allOrders.filter(
                    (order) =>
                        order.customerFirstName.toLowerCase().includes(search.value.toString().toLowerCase()) ||
                        order.customerLastName.toLowerCase().includes(search.value.toString().toLowerCase()) ||
                        order.id.toString().includes(search.value.toString())
                )
                : allOrders;

        sortAndSet(dataToSort.filter((order) => belongsToFolder(order, currentFolder)));
    }, [allOrders, config, currentFolder, search.value, sortBy, sortDirection]);

    useEffect(() => {
        setOpenedOrder(orderToOpen.current);
    }, [openedOrder]);

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
        if (!(usersState.loggedUser?.admin || usersState.loggedUser?.operator)) {
            window.alert(contentToText(ContentID.errorThisOperationRequiresAdminOrOperatorRights, config));
        } else if (confirm(`${contentToText(ContentID.adminOrdersDeleteOrder, config)} ${order.id} (${order.customerFirstName} ${order.customerLastName})?`)) {
            setOpenedOrder(null);

            const res = await orderDelete({ order: order, config: config }).unwrap();

            if (res.success) {
                setOrders([...orders].filter((o) => o.id !== order.id));
            }

            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));
        }
    };

    const handleMarkAsDelivered = async (order: Order) => {
        const res = await updateOrder(order.id, { deliveredDate: new Date() });

        handleClose();

        if (res.order) {
            const returnedOrder = res.order;
            setOrders(
                orders.map((o) => {
                    return o.id !== order.id ? o : returnedOrder;
                })
            );
        }

        dispatch(setNotification(getNotification(order, Folder.DELIVERED, 'Positive')));
    };

    const handleMarkAsNotDelivered = async (order: Order) => {
        const res = await updateOrder(order.id, { deliveredDate: null });

        handleClose();

        if (res.order) {
            const returnedOrder = res.order;
            setOrders(
                orders.map((o) => {
                    return o.id !== order.id ? o : returnedOrder;
                })
            );
        }

        dispatch(setNotification(getNotification(order, Folder.PROCESSING, 'Positive')));
    };

    const handleMoveBackFromRecycleBin = async (order: Order) => {
        await updateOrder(order.id, { recycledDate: null });

        handleClose();
        dispatch(setNotification(getNotification(order, order.deliveredDate ? Folder.DELIVERED : Folder.PROCESSING, 'Positive')));
    };

    const handleMoveToRecycleBin = async (order: Order) => {
        await updateOrder(order.id, { recycledDate: new Date() });

        handleClose();

        dispatch(setNotification(getNotification(order, Folder.RECYCLEBIN, 'Neutral')));
    };

    const handleOpen = async (order: Order) => {
        if (!order.readDate) {
            const res = await updateOrder(order.id, { readDate: new Date() });

            if (res.order) {
                const returnedOrder = res.order;
                setOrders(
                    orders.map((o) => {
                        return o.id !== order.id ? o : returnedOrder;
                    })
                );
            }
        }

        orderToOpen.current = order;
        setOpenedOrder(order);
    };

    const gridColumnHeader = (label: ContentID, sortByOption: sortByOption) => (
        <div onClick={() => setSorting(sortByOption)}>
            <span
                className='clickable'
                title={contentToText(sortBy === sortByOption ? ContentID.miscClickToChangeSortingOrder : ContentID.miscClickToSortByThis, config)}
            >
                {contentToText(label, config)}
            </span>{' '}
            <SortArrow column={sortByOption} sortBy={sortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} config={config} />
        </div>
    );

    const menuItemDiv = (folderName: Folder) => {
        const orderCount = allOrders.filter((o) => belongsToFolder(o, folderName)).length;

        return currentFolder === folderName ? (
            <div className='bold flex-item underlined thin'>
                {folderLabel(folderName)} ({orderCount})
            </div>
        ) : (
            <div className='flex-item semiBold'>
                <Link to={`${window.location.pathname}?folder=${folderName}`}>
                    {folderLabel(folderName)} ({orderCount})
                </Link>
            </div>
        );
    };

    const orderGridRow = (order: Order) => (
        <React.Fragment key={order.id}>
            <AdminOrderGridRow key={order.id} order={order} isOpened={openedOrder?.id === order.id} handleClose={handleClose} handleOpen={handleOpen} />
            {openedOrder?.id === order.id && (
                <AdminOrderDetails
                    order={order}
                    handleDelete={handleDelete}
                    handleMarkAsDelivered={handleMarkAsDelivered}
                    handleMarkAsNotDelivered={handleMarkAsNotDelivered}
                    handleMoveBackFromRecycleBin={handleMoveBackFromRecycleBin}
                    handleMoveToRecycleBin={handleMoveToRecycleBin}
                />
            )}
        </React.Fragment>
    );

    if (!orderGetAll.data) {
        return <LoadingQuery query={orderGetAll} config={config} />;
    }

    return (
        <div>
            <div className='adminOrdersMenu flex-container' data-justify='center'>
                {menuItemDiv(Folder.PROCESSING)}
                <div className='colorGrayLight bold'>|</div>
                {menuItemDiv(Folder.DELIVERED)}
                <div className='colorGrayLight bold'>|</div>
                {menuItemDiv(Folder.RECYCLEBIN)}
            </div>
            <br />
            <div className='flex-container searchBox' data-gap='1rem 2rem'>
                <div className='semiBold'>{contentToText(search.label, config)}:</div>
                <div>
                    <InputField
                        useField={search}
                        width={'20rem'}
                        placeHolder={`${contentToText(ContentID.miscCustomers, config)} ${contentToText(
                            ContentID.miscName,
                            config
                        ).toLowerCase()} ${contentToText(ContentID.miscOr, config)} ${contentToText(ContentID.orderId, config).toLowerCase()}`}
                    />
                </div>
                <div className='alignLeft'>
                    <button type='button' onClick={() => search.setNewValue('')}>
                        {contentToText(ContentID.buttonClear, config)}
                    </button>
                </div>
            </div>
            <br />
            <div className='adminOrdersList grid-container left middle stripedBackground' data-cols='orders'>
                <div className='displayContents gridHeaderRowDarkGray'>
                    {gridColumnHeader(ContentID.miscDate, 'date')}
                    {gridColumnHeader(ContentID.orderCustomer, 'customer')}
                    {gridColumnHeader(ContentID.orderTotalAmount, 'totalSum')}
                    {gridColumnHeader(ContentID.orderDeliveryMethod, 'delivery')}
                    {gridColumnHeader(ContentID.orderStatus, 'status')}
                    <div />
                </div>
                {orders.length > 0 ? (
                    orders.map((order) => orderGridRow(order))
                ) : (
                    <>
                        <div className='alignCenter gridSpan6 padding1 semiBold'>
                            <span className='sizeLarge'>
                                {contentToText(ContentID.adminOrdersNoOrdersInFolder, config)} <span className='bold'>{folderLabel(currentFolder)}</span>.
                            </span>
                            {search.stringValue().length > 0 && (
                                <span>
                                    {` ${contentToText(ContentID.miscWithSearchWords, config)} `} <span className='italic'>{`'${search.stringValue()}'`}</span>.
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
            <br />
            <br />
        </div>
    );
};

export default AdminOrders;
