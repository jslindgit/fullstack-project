import { Op } from 'sequelize';

import Order, { NewOrder, OrderAttributes, OrderInstance } from '../models/order';

import { handleError } from '../util/error_handler';
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
                    } else {
                        throw new Error(`Invalid property '${key}' for Order`);
                    }
                });

                await order.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }
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
    getAll,
    getById,
    update,
};
