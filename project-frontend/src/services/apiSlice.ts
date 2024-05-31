import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { ItemResponse } from './itemService';
import { Order } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';
import { Item, NewItem, Response } from '../types/types';

import { apiBaseUrl, API_KEY } from '../constants';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { orderFromResponseBody } from '../util/orderProvider';
import { itemFromResBody, itemToReqBody } from '../util/serviceProvider';
import { isNotNull } from '../types/typeFunctions';

interface InstockAndSold {
    sizes: string[];
    sold: number;
}

interface ItemDeleteResponse {
    success: boolean;
}

const transformResponseItem = (itemRes: Item, successMessage: ContentID, config: Config): ItemResponse => {
    const item = itemFromResBody(itemRes);
    if (item) {
        return {
            success: true,
            message: `${contentToText(successMessage, config)}: ${langTextsToText(item.name, config)}`,
            item: item,
        };
    } else {
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), item: null };
    }
};

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
    tagTypes: ['Item', 'Order'],
    endpoints: (builder) => ({
        // ITEMS:
        itemAdd: builder.mutation<ItemResponse, { newItem: NewItem; config: Config }>({
            query: ({ newItem }) => {
                return {
                    url: '/items',
                    method: 'POST',
                    body: itemToReqBody(newItem),
                };
            },
            invalidatesTags: ['Item'],
            transformResponse: (itemRes: Item, _meta, arg) => {
                return transformResponseItem(itemRes, ContentID.adminItemsNewItemAdded, arg.config);
            },
        }),
        itemDelete: builder.mutation<Response, { item: Item; config: Config }>({
            query: ({ item }) => {
                return {
                    url: `/items/${item.id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Item'],
            transformResponse: (response: ItemDeleteResponse, _meta, arg) => {
                if (response && response.success) {
                    return {
                        success: true,
                        message: `${contentToText(ContentID.itemsItem, arg.config)} "${langTextsToText(arg.item.name, arg.config)}" ${contentToText(
                            ContentID.miscDeleted,
                            arg.config
                        )}.`,
                    };
                } else {
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config) };
                }
            },
        }),
        itemGetAll: builder.query<Item[], void>({
            query: () => '/items',
            providesTags: ['Item'],
            transformResponse: (res: Item[]) => {
                return res.map((itemData) => itemFromResBody(itemData)).filter(isNotNull);
            },
        }),
        itemGetById: builder.query<Item | null, number>({
            query: (id) => `items/${id}`,
            providesTags: ['Item'],
            transformResponse: (res: Item) => {
                return itemFromResBody(res);
            },
        }),
        itemGetBySearchQuery: builder.query<Item[], { searchQuery: string; config: Config }>({
            query: () => '/items',
            providesTags: ['Item'],
            transformResponse: (res: Item[], _meta, arg) => {
                const items: Item[] = [];
                res.forEach((itemData) => {
                    const item = itemFromResBody(itemData);
                    if (item && langTextsToText(item.name, arg.config).toLowerCase().includes(arg.searchQuery.toLowerCase())) {
                        items.push(item);
                    }
                });
                return items;
            },
        }),
        itemUpdate: builder.mutation<ItemResponse, { itemToUpdate: Item; config: Config }>({
            query: ({ itemToUpdate }) => {
                const body = itemToReqBody(itemToUpdate);
                return {
                    url: `/items/${itemToUpdate.id}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: ['Item'],
            transformResponse: (itemRes: Item, _meta, arg) => {
                return transformResponseItem(itemRes, ContentID.adminItemsItemUpdated, arg.config);
            },
        }),
        itemUpdateInstockAndSold: builder.mutation<void, { itemId: number; instockAndSold: InstockAndSold }>({
            query: ({ itemId, instockAndSold }) => {
                return {
                    url: `items/updateinstockandsold/${itemId}`,
                    method: 'PUT',
                    body: instockAndSold,
                };
            },
            invalidatesTags: ['Item'],
        }),
        // ORDERS:
        orderGetAll: builder.query<Order[], void>({
            query: () => '/orders',
            providesTags: ['Order'],
            transformResponse: (res: Order[]) => {
                return res.map((order) => orderFromResponseBody(order)).filter(isNotNull);
            },
        }),
    }),
});

export const {
    useItemAddMutation,
    useItemDeleteMutation,
    useItemGetAllQuery,
    useItemGetByIdQuery,
    useItemGetBySearchQueryQuery,
    useItemUpdateMutation,
    useOrderGetAllQuery,
} = apiSlice;
export const { itemGetById } = apiSlice.endpoints;
