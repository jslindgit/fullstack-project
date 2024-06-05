import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { User, NewUser, Response } from '../types/types';

import { handleError } from '../util/handleError';
import { contentToText } from '../types/languageFunctions';
import { isBoolean, isObject, isUser } from '../types/typeFunctions';
import { isNotNull } from '../types/typeFunctions';

import { apiSlice, successfulResponse } from './apiSlice';

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
            transformResponse: (res: unknown, _meta, arg) => {
                // prettier-ignore
                return successfulResponse(res)
                    ? {
                        success: true,
                        message: `${contentToText(ContentID.user, arg.config)} ${arg.toDelete.contactFirstName} ${arg.toDelete.contactLastName} (${
                            arg.toDelete.username
                        }) ${contentToText(ContentID.miscDeleted, arg.config)}.`,
                    }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrong, arg.config) };
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
        userGetByToken: builder.query<User | null, { token: string }>({
            query: ({ token }) => {
                return {
                    url: `${url}/me`,
                    method: 'GET',
                    headers: { authorization: `bearer ${token}` },
                };
            },
            transformResponse: (res: unknown) => {
                return isUser(res) ? res : null;
            },
        }),
        userNameIsAvailable: builder.query<boolean, { username: string }>({
            query: ({ username }) => `${url}/username/${username}`,
            transformResponse: (res: unknown): boolean => {
                return isObject(res) && 'isAvailable' in res && isBoolean(res.isAvailable) && res.isAvailable === true;
            },
        }),
        userUpdate: builder.mutation<UserResponse, { userId: number; propsToUpdate: object; propertyName: ContentID; config: Config }>({
            query: ({ userId, propsToUpdate }) => {
                return {
                    url: `${url}/${userId}`,
                    method: 'PUT',
                    body: propsToUpdate,
                };
            },
            invalidatesTags: ['User'],
            transformResponse: (res: unknown, _meta, arg) => {
                if (isUser(res)) {
                    return {
                        success: true,
                        message: `${contentToText(arg.propertyName, arg.config)} ${contentToText(ContentID.userUpdated, arg.config)}`,
                        user: res,
                    };
                } else {
                    handleError(new Error('Server did not return a User object'));
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config), user: null };
                }
            },
        }),
    }),
});

export const { useUserAddMutation, useUserDeleteMutation, useUserGetAllQuery, useUserGetByIdQuery, useUserUpdateMutation } = userApiSlice;

export const { userAdd, userGetByToken, userNameIsAvailable } = userApiSlice.endpoints;
