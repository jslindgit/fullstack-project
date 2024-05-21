import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Order } from '../types/orderTypes';
import { Item } from '../types/types';

import { apiBaseUrl } from '../constants';
import { itemFromResBody } from '../util/serviceProvider';
import { isNotNull } from '../types/typeFunctions';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    endpoints: (builder) => ({
        getAllItems: builder.query<Item[], void>({
            query: () => '/items',
            transformResponse: (res: Item[]) => {
                return res.map((itemData) => itemFromResBody(itemData)).filter(isNotNull);
            },
        }),
        getAllOrders: builder.query<Order[], void>({
            query: () => '/orders',
        }),
    }),
});

export const { useGetAllItemsQuery, useGetAllOrdersQuery } = apiSlice;
