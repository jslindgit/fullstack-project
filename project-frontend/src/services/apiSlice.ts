import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { ItemResponse } from './itemService';
import { Order } from '../types/orderTypes';
import { Item, NewItem } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { apiBaseUrl, API_KEY } from '../constants';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { orderFromResponseBody } from '../util/orderProvider';
import { itemFromResBody, itemToReqBody } from '../util/serviceProvider';
import { isNotNull } from '../types/typeFunctions';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,
        prepareHeaders: (headers, { getState }) => {
            headers.set('apikey', `api_key ${API_KEY}`);

            const state = getState() as RootState;
            if (state.user.token) {
                headers.set('authorization', `bearer ${state.user.token}`);
            }
        },
    }),
    endpoints: (builder) => ({
        itemAdd: builder.mutation<ItemResponse, { newItem: NewItem; categoryId: number | null; config: Config }>({
            query: ({ newItem, categoryId }) => {
                const body = categoryId ? { ...itemToReqBody(newItem), category_id: categoryId } : itemToReqBody(newItem);
                return {
                    url: '/items',
                    method: 'POST',
                    body,
                };
            },
            transformResponse: (itemRes: Item, _meta, arg) => {
                const item = itemFromResBody(itemRes);
                if (item) {
                    return {
                        success: true,
                        message: `${contentToText(ContentID.adminItemsNewItemAdded, arg.config)}: ${langTextsToText(item.name, arg.config)}`,
                        item: item,
                    };
                } else {
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config), item: null };
                }
            },
        }),
        itemGetAll: builder.query<Item[], void>({
            query: () => '/items',
            transformResponse: (res: Item[]) => {
                return res.map((itemData) => itemFromResBody(itemData)).filter(isNotNull);
            },
        }),
        orderGetAll: builder.query<Order[], void>({
            query: () => '/orders',
            transformResponse: (res: Order[]) => {
                return res.map((order) => orderFromResponseBody(order)).filter(isNotNull);
            },
        }),
    }),
});
