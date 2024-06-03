import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { DeleteResponse, User, NewUser, Response } from '../types/types';

import { contentToText } from '../types/languageFunctions';
import { isUser } from '../types/typeFunctions';
import { isNotNull } from '../types/typeFunctions';

import { apiSlice } from './apiSlice';

interface UserResponse extends Response {
    user: User | null;
}

const url = '/users';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        userAdd: builder.mutation<UserResponse, { toAdd: NewUser; config: Config }>({
            query: ({ toAdd }) => {
                return {
                    url: url,
                    method: 'POST',
                    body: toAdd,
                };
            },
            invalidatesTags: ['User'],
            transformResponse: (res: unknown, _meta, arg) => {
                if (isUser(res)) {
                    return { success: true, message: contentToText(ContentID.registerSuccess, arg.config) + ' ' + res.username, user: res };
                } else {
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config), user: null };
                }
            },
        }),
        userDelete: builder.mutation<Response, { toDelete: User; config: Config }>({
            query: ({ toDelete }) => {
                return {
                    url: `${url}/${toDelete.id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['User'],
            transformResponse: (res: DeleteResponse, _meta, arg) => {
                console.log('res:', res);
                if (res && res.success) {
                    return {
                        success: true,
                        message: `${contentToText(ContentID.user, arg.config)} ${arg.toDelete.contactFirstName} ${arg.toDelete.contactLastName} (${
                            arg.toDelete.username
                        }) ${contentToText(ContentID.miscDeleted, arg.config)}.`,
                    };
                } else {
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, arg.config) };
                }
            },
        }),
        userGetAll: builder.query<User[], void>({
            query: () => url,
            providesTags: ['User'],
            transformResponse: (res: User[]) => {
                return res.map((itemData) => itemData).filter(isNotNull);
            },
        }),
        userGetById: builder.query<User | null, number>({
            query: (id) => `${url}/${id}`,
            providesTags: ['User'],
            transformResponse: (res: User) => {
                return res;
            },
        }),
    }),
});

export const { useUserAddMutation, useUserDeleteMutation, useUserGetAllQuery, useUserGetByIdQuery } = userApiSlice;

export const { userAdd } = userApiSlice.endpoints;
