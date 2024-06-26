import { Op } from 'sequelize';

import Order, { NewOrder, OrderAttributes, OrderInstance } from '../models/order';

import { handleError } from '../util/error_handler';
import { dateFormat } from '../util/misc';
import { isNumber, isObject } from '../types/type_functions';

const addNew = async (newOrder: NewOrder): Promise<OrderInstance | null> => {
    try {
        const order = await Order.create(newOrder);
        await order.save();
        return order;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<OrderInstance | null> => {
    try {
        const order = await getById(id);
        if (order) {
            await order.destroy();
        }
        return order;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteExpiredUnpaidOrders = async () => {
    try {
        const expirationTimeHours = 24;

        console.log(`Deleting unpaid orders older than ${expirationTimeHours} hours...`);

        const unpaidOrders = (await getAll()).filter((order) => order.status === 'PENDING');

        const hasExpired = (order: OrderInstance): boolean => {
            if ('createdAt' in order && order.createdAt instanceof Date) {
                const currentTime = new Date();
                const differenceHours = (currentTime.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60);

                return differenceHours >= expirationTimeHours;
            }
            return false;
        };

        const expiredOrders = unpaidOrders.filter((order) => hasExpired(order));

        console.log(expiredOrders.length + ' expired orders found.');

        const promises: Promise<OrderInstance | null>[] = [];

        expiredOrders.forEach((order) => {
            console.log(
                `Deleting order #${order.id} (${order.customerFirstName} ${order.customerLastName})` +
                    ('createdAt' in order && order.createdAt instanceof Date ? ` [${dateFormat(order.createdAt)}]...` : '...')
            );

            promises.push(deleteById(order.id));
        });

        await Promise.all(promises);
    } catch (err: unknown) {
        handleError(err);
    }
};

const getAll = async (searchQuery: string = ''): Promise<OrderInstance[]> => {
    try {
        let where = {};
        if (searchQuery && searchQuery.length > 0) {
            where = {
                [Op.or]: [
                    {
                        id: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        customerFirstName: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        customerLastName: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }

        const orders = await Order.findAll({
            where,
            order: [['created_at', 'DESC']],
        });

        return orders;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const getById = async (id: unknown): Promise<OrderInstance | null> => {
    try {
        const order = isNumber(Number(id)) ? await Order.findByPk(Number(id)) : null;
        return order;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (id: unknown, props: unknown): Promise<OrderInstance | null> => {
    try {
        const order = await getById(id);
        if (order) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in order && key !== 'id') {
                        order.setDataValue(key as keyof OrderAttributes, props[key as keyof typeof props]);
                    } else if (key !== 'id') {
                        console.warn(`Invalid property '${key}' for Order`);
                    }
                });

                await order.save();
            } else {
                handleError(new Error('Invalid props value (not an object)'));
            }
        } else {
            console.warn(`Order with id ${id} not found.`);
        }
        return order;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

export default {
    addNew,
    deleteById,
    deleteExpiredUnpaidOrders,
    getAll,
    getById,
    update,
};
