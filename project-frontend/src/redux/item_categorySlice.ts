import { Category, Item, Response } from '../types/types';

import { isBoolean, isObject } from '../types/typeFunctions';

import { apiSlice } from './apiSlice';

const url = '/item_categories';

const item_categorySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        item_categoryAdd: builder.mutation<Response, { item: Item; category: Category }>({
            query: ({ item, category }) => {
                console.log('item_categoryAdd.query started...');
                return {
                    url: url,
                    method: 'POST',
                    body: { item_id: item.id, category_id: category.id },
                };
            },
            invalidatesTags: ['Category', 'Item'],
            transformResponse: (res: unknown) => {
                const success = isObject(res) && 'success' in res && isBoolean(res.success) && res.success === true;
                console.log('item_categoryAdd.res:', res);
                return { success: success, message: success ? 'Ok' : 'Error' };
            },
        }),
        item_categoryDelete: builder.mutation<Response, { itemId: number; categoryId: number }>({
            query: ({ itemId, categoryId }) => {
                return {
                    url: url,
                    method: 'DELETE',
                    body: { item_id: itemId, category_id: categoryId },
                };
            },
            invalidatesTags: ['Category', 'Item'],
            transformResponse: (res: unknown) => {
                const success = isObject(res) && 'success' in res && isBoolean(res.success) && res.success === true;
                return { success: success, message: success ? 'Ok' : 'Error' };
            },
        }),
    }),
});

export const { useItem_categoryAddMutation, useItem_categoryDeleteMutation } = item_categorySlice;
