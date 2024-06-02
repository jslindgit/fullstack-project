import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { ItemResponse } from '../services/itemService';
import { DeleteResponse, Item, NewItem, Response } from '../types/types';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import { itemFromResBody, itemToReqBody } from '../util/serviceProvider';
import { isNotNull } from '../types/typeFunctions';

import { apiSlice } from './apiSlice';

interface InstockAndSold {
    sizes: string[];
    sold: number;
}

const transformResponse = (res: Item, successMessage: ContentID, config: Config): ItemResponse => {
    const item = itemFromResBody(res);
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

const url = '/items';

export const itemApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        itemAdd: builder.mutation<ItemResponse, { toAdd: NewItem; config: Config }>({
            query: ({ toAdd }) => {
                return {
                    url: url,
                    method: 'POST',
                    body: itemToReqBody(toAdd),
                };
            },
            invalidatesTags: ['Category', 'Item'],
            transformResponse: (itemRes: Item, _meta, arg) => {
                return transformResponse(itemRes, ContentID.adminItemsNewItemAdded, arg.config);
            },
        }),
        itemDelete: builder.mutation<Response, { toDelete: Item; config: Config }>({
            query: ({ toDelete }) => {
                return {
                    url: `${url}/${toDelete.id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Category', 'Item'],
            transformResponse: (response: DeleteResponse, _meta, arg) => {
                if (response && response.success) {
                    return {
                        success: true,
                        message: `${contentToText(ContentID.itemsItem, arg.config)} "${langTextsToText(arg.toDelete.name, arg.config)}" ${contentToText(
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
            query: () => url,
            providesTags: ['Item'],
            transformResponse: (res: Item[]) => {
                return res.map((itemData) => itemFromResBody(itemData)).filter(isNotNull);
            },
        }),
        itemGetById: builder.query<Item | null, number>({
            query: (id) => `${url}/${id}`,
            providesTags: ['Item'],
            transformResponse: (res: Item) => {
                return itemFromResBody(res);
            },
        }),
        itemGetBySearchQuery: builder.query<Item[], { searchQuery: string; config: Config }>({
            query: () => url,
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
        itemUpdate: builder.mutation<ItemResponse, { toUpdate: Item; config: Config }>({
            query: ({ toUpdate }) => {
                const body = itemToReqBody(toUpdate);
                return {
                    url: `${url}/${toUpdate.id}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: ['Category', 'Item'],
            transformResponse: (itemRes: Item, _meta, arg) => {
                return transformResponse(itemRes, ContentID.adminItemsItemUpdated, arg.config);
            },
        }),
        itemUpdateInstockAndSold: builder.mutation<void, { itemId: number; instockAndSold: InstockAndSold }>({
            query: ({ itemId, instockAndSold }) => {
                return {
                    url: `${url}/updateinstockandsold/${itemId}`,
                    method: 'PUT',
                    body: instockAndSold,
                };
            },
            invalidatesTags: ['Item'],
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
    useItemUpdateInstockAndSoldMutation,
} = itemApiSlice;

export const { itemGetById, itemUpdateInstockAndSold } = itemApiSlice.endpoints;
