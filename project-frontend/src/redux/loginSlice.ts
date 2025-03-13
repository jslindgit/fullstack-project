import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { ErrorResponse, Response, User } from '../types/types';

import { contentToText } from '../types/languageFunctions';
import { isUser } from '../types/types';

import { apiSlice, successfulResponse } from './apiSlice';

const url = '/login';

const loginSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        changePassword: builder.mutation<Response, { username: string; currentPassword: string; newPassword: string; config: Config }>({
            query: ({ username, currentPassword, newPassword }) => {
                return {
                    url: `${url}/changepassword`,
                    method: 'POST',
                    body: { username: username, password: currentPassword, newPassword: newPassword },
                };
            },
            transformResponse: (res: unknown, _meta, arg) => {
                return successfulResponse(res)
                    ? { success: true, message: contentToText(ContentID.loginPasswordChangedSuccessfully, arg.config) }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config) };
            },
            transformErrorResponse: (res: ErrorResponse, _meta, arg) => {
                return {
                    success: false,
                    message: contentToText(res.status === 401 ? ContentID.loginInvalidPassword : ContentID.errorSomethingWentWrong, arg.config),
                    status: res.status,
                };
            },
        }),
        checkPassword: builder.mutation<Response, { username: string; password: string; config: Config }>({
            query: ({ username, password }) => {
                return {
                    url: `${url}/checkpassword`,
                    method: 'POST',
                    body: { username: username, password: password },
                };
            },
            transformResponse: (res: unknown, _meta, arg) => {
                return successfulResponse(res)
                    ? { success: true, message: 'Ok' }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrong, arg.config) };
            },
            transformErrorResponse: (res: ErrorResponse, _meta, arg) => {
                return {
                    success: false,
                    message: contentToText(res.status === 401 ? ContentID.loginInvalidPassword : ContentID.errorSomethingWentWrong, arg.config),
                };
            },
        }),
        login: builder.mutation<Response, { username: string; password: string; setLoggedUser: (loggedUser: User) => void; config: Config }>({
            query: ({ username, password }) => {
                return {
                    url: url,
                    method: 'POST',
                    body: { username: username, password: password },
                };
            },
            transformResponse: (res: unknown, _meta, arg) => {
                if (isUser(res)) {
                    if (res.disabled === true) {
                        return { success: false, message: contentToText(ContentID.userDisabled, arg.config) };
                    } else {
                        arg.setLoggedUser(res);
                        return { success: true, message: contentToText(ContentID.loginLoggedInAs, arg.config) + ' ' + res.username };
                    }
                } else {
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, arg.config) };
                }
            },
            transformErrorResponse: (res: ErrorResponse, _meta, arg) => {
                return {
                    success: false,
                    message: contentToText(res.status === 401 ? ContentID.loginInvalidUsernameOrPassword : ContentID.errorSomethingWentWrong, arg.config),
                };
            },
        }),
        logout: builder.mutation<void, { removeLoggedUser: () => void }>({
            query: () => {
                return {
                    url: url,
                    method: 'DELETE',
                };
            },
            transformResponse: (_res: unknown, _meta, arg) => {
                arg.removeLoggedUser();
            },
        }),
    }),
});

export const { useChangePasswordMutation, useCheckPasswordMutation, useLoginMutation, useLogoutMutation } = loginSlice;

export const { login } = loginSlice.endpoints;
