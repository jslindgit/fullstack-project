import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { OrderResponse } from '../services/orderService';
import { NewOrder, Order } from '../types/orderTypes';
import { DeleteResponse, Response } from '../types/types';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import { orderFromResponseBody, orderToRequestBody } from '../util/orderProvider';
import { isNotNull } from '../types/typeFunctions';

import { apiSlice } from './apiSlice';

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
            transformResponse: (orderRes: Order, _meta, arg) => {
                return transformResponse(orderRes, 'Ok', arg.config);
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
            transformResponse: (response: DeleteResponse, _meta, arg) => {
                if (response && response.success) {
                    return {
                        success: true,
                        message: `${contentToText(ContentID.miscOrder, arg.config)} #${arg.order.id} (${arg.order.customerFirstName} ${
                            arg.order.customerLastName
                        }) ${contentToText(ContentID.miscDeleted, arg.config)}.`,
                    };
                } else {
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config) };
                }
            },
        }),
        orderGetAll: builder.query<Order[], void>({
            query: () => '/orders',
            providesTags: ['Order'],
            transformResponse: (res: Order[]) => {
                return res.map((order) => orderFromResponseBody(order)).filter(isNotNull);
            },
        }),
    }),
});

export const { useOrderAddMutation, useOrderDeleteMutation, useOrderGetAllQuery } = orderApiSlice;
