import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from '../rootReducer';

import { apiBaseUrl, API_KEY } from '../../constants';
import { isBoolean, isObject } from '../../types/typeFunctions';

export const successfulResponse = (res: unknown): boolean => {
    return isObject(res) && 'success' in res && isBoolean(res.success) && res.success === true;
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
    tagTypes: ['Category', 'Item', 'Order', 'Settings', 'User'],
    endpoints: () => ({}),
});
