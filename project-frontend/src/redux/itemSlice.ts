import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { Item, ItemResponse, NewItem, Response } from '../types/types';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import { itemFromResBody, itemToReqBody } from '../util/serviceProvider';
import { isNotNull } from '../types/typeFunctions';

import { apiSlice, successfulResponse } from './apiSlice';

interface InstockAndSold {
    sizes: string[];
    sold: number;
}

const url = '/items';

export const itemApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        itemAdd: builder.mutation<ItemResponse, { toAdd: NewItem; categoryIds: number[]; config: Config }>({
            query: ({ toAdd, categoryIds }) => {
                return {
                    url: url,
                    method: 'POST',
                    body: { ...itemToReqBody(toAdd), category_ids: categoryIds },
                };
            },
            invalidatesTags: ['Category', 'Item'],
            transformResponse: (res: Item, _meta, arg) => {
                return {
                    success: true,
                    message: `${contentToText(ContentID.adminItemsNewItemAdded, arg.config)}: ${langTextsToText(arg.toAdd.name, arg.config)}.`,
                    item: itemFromResBody(res),
                };
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
            transformResponse: (res: unknown, _meta, arg) => {
                // prettier-ignore
                return successfulResponse(res)
                    ? {
                        success: true,
                        message: `${contentToText(ContentID.itemsItem, arg.config)} "${langTextsToText(arg.toDelete.name, arg.config)}" ${contentToText(
                            ContentID.miscDeleted,
                            arg.config
                        )}.`,
                    }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config) };
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
        itemUpdate: builder.mutation<ItemResponse, { toUpdate: Item; categoryIds: number[] | null; config: Config }>({
            query: ({ toUpdate, categoryIds }) => {
                const body = itemToReqBody(toUpdate);
                return {
                    url: `${url}/${toUpdate.id}`,
                    method: 'PUT',
                    body: categoryIds ? { ...body, category_ids: categoryIds } : body,
                };
            },
            invalidatesTags: ['Category', 'Item'],
            transformResponse: (res: Item, _meta, arg) => {
                return {
                    success: true,
                    message: `${contentToText(ContentID.adminItemsItemUpdated, arg.config)}: ${langTextsToText(arg.toUpdate.name, arg.config)}.`,
                    item: itemFromResBody(res),
                };
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
            invalidatesTags: ['Category', 'Item'],
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
