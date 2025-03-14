import { ContentID } from '../../content';
import { Config } from '../../types/configTypes';
import { NewOrder, Order, OrderResponse } from '../../types/orderTypes';
import { Response } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';
import { orderFromResponseBody, orderToRequestBody } from '../../util/orderProvider';
import { isNotNull } from '../../types/typeFunctions';

import { apiSlice, successfulResponse } from './apiSlice';

const transformResponse = (res: Order, successMessage: string, config: Config): OrderResponse => {
    const order = orderFromResponseBody(res);
    if (order) {
        return {
            success: true,
            message: successMessage,
            order: order,
        };
    } else {
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), order: null };
    }
};

const url = '/orders';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        orderAdd: builder.mutation<OrderResponse, { toAdd: NewOrder; userId: number | null; config: Config }>({
            query: ({ toAdd, userId, config }) => {
                return {
                    url: url,
                    method: 'POST',
                    body: orderToRequestBody(toAdd, config, false, userId),
                };
            },
            invalidatesTags: ['Order'],
            transformResponse: (res: Order, _meta, arg) => {
                return transformResponse(res, 'Ok', arg.config);
            },
        }),
        orderDelete: builder.mutation<Response, { order: Order; config: Config }>({
            query: ({ order }) => {
                return {
                    url: `/orders/${order.id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Order'],
            transformResponse: (res: unknown, _meta, arg) => {
                // prettier-ignore
                return successfulResponse(res)
                    ? {
                        success: true,
                        message: `${contentToText(ContentID.miscOrder, arg.config)} #${arg.order.id} (${arg.order.customerFirstName} ${
                            arg.order.customerLastName
                        }) ${contentToText(ContentID.miscDeleted, arg.config)}.`,
                    }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config) };
            },
        }),
        orderGetAll: builder.query<Order[], void>({
            query: () => '/orders',
            providesTags: ['Order'],
            transformResponse: (res: Order[]) => {
                return res.map((order) => orderFromResponseBody(order)).filter(isNotNull);
            },
        }),
        orderGetById: builder.query<OrderResponse, { id: number }>({
            query: ({ id }) => `${url}/${id}`,
            providesTags: ['Order'],
            transformResponse: (res: Order, _meta, arg) => {
                const order = orderFromResponseBody(res);
                if (order) {
                    return { success: true, message: 'Ok', order: order };
                } else {
                    return { success: false, message: `Failed to retrieve order ${arg.id}`, order: null };
                }
            },
        }),
        orderUpdate: builder.mutation<OrderResponse, { orderId: number; propsToUpdate: object; config: Config }>({
            query: ({ orderId, propsToUpdate }) => {
                return {
                    url: `${url}/${orderId}`,
                    method: 'PUT',
                    body: propsToUpdate,
                };
            },
            invalidatesTags: ['Order'],
            transformResponse: (res: Order, _meta, arg) => {
                return transformResponse(
                    res,
                    `${contentToText(ContentID.miscOrder, arg.config)} ${contentToText(ContentID.miscUpdated, arg.config)}.`,
                    arg.config
                );
            },
        }),
    }),
});

export const { useOrderAddMutation, useOrderDeleteMutation, useOrderGetAllQuery, useOrderGetByIdQuery, useOrderUpdateMutation } = orderApiSlice;
