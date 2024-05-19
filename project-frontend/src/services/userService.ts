import axios from 'axios';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { NewUser, Response, User } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import { contentToText } from '../types/languageFunctions';
import { apiKeyConfig, authConfig } from '../util/serviceProvider';
import { isBoolean, isObject, isUser } from '../types/typeFunctions';

type UserResponse = Response & { user: User | null };

const url = apiBaseUrl + '/users';

const addNew = async (newUser: NewUser, config: Config): Promise<UserResponse> => {
    try {
        const { data } = await axios.post(url, newUser, apiKeyConfig());
        if (isUser(data)) {
            return { success: true, message: contentToText(ContentID.registerSuccess, config) + ' ' + data.username, user: data };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), user: null };
        }
    } catch (err: unknown) {
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config), user: null };
    }
};

const deleteUser = async (user: User, token: string, config: Config): Promise<UserResponse> => {
    try {
        const res = await axios.delete<User>(`${url}/${user.id}`, authConfig(token));
        if (res.status === 204) {
            return {
                success: true,
                message: `${contentToText(ContentID.user, config)} ${user.contactFirstName} ${user.contactLastName} (${user.username}) ${contentToText(
                    ContentID.miscDeleted,
                    config
                )}.`,
                user: user,
            };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), user: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorOccurred, config), user: null };
    }
};

const getAll = async (): Promise<User[]> => {
    try {
        const { data } = await axios.get<User[]>(url, apiKeyConfig());
        return data;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const getById = async (id: number) => {
    try {
        const { data } = await axios.get<User>(`${url}/${id}`, apiKeyConfig());
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const getByToken = async (token: string): Promise<UserResponse> => {
    try {
        const { data } = await axios.get<User>(`${url}/me`, authConfig(token));
        return { success: true, message: 'Ok', user: data };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : 'Error occurred', user: null };
    }
};

const update = async (userId: number, toUpdate: object, propertyName: ContentID, token: string, config: Config): Promise<UserResponse> => {
    try {
        const res = await axios.put<User>(`${url}/${userId}`, toUpdate, authConfig(token));
        const updatedUser = res.data;

        if (updatedUser) {
            return {
                success: true,
                message: `${contentToText(propertyName, config)} ${contentToText(ContentID.userUpdated, config)}`,
                user: updatedUser,
            };
        } else {
            handleError(new Error('Server did not return a User object'));
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), user: null };
        }
    } catch (err: unknown) {
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config), user: null };
    }
};

const usernameIsAvailable = async (username: string): Promise<boolean> => {
    try {
        const { data } = await axios.get(`${url}/username/${username}`, apiKeyConfig());

        return isObject(data) && 'isAvailable' in data && isBoolean(data.isAvailable) && data.isAvailable === true;
    } catch (err: unknown) {
        handleError(err);
        return false;
    }
};

export default {
    addNew,
    deleteUser,
    getAll,
    getById,
    getByToken,
    update,
    usernameIsAvailable,
};
