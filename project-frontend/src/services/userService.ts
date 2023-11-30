import axios from 'axios';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { NewUser, Response, User } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import { contentToText } from '../types/languageFunctions';
import { apiKeyConfig, authConfig } from '../util/serviceProvider';
import { isUser } from '../types/typeFunctions';

type UserResponse = Response & { user: User | null };

const url = apiBaseUrl + '/users';

const addNew = async (newUser: NewUser, config: Config): Promise<UserResponse> => {
    try {
        const { data } = await axios.post(url, newUser, apiKeyConfig());
        if (isUser(data)) {
            return { success: true, message: contentToText(ContentID.registerSuccess, config) + ' ' + data.username, user: data };
        } else {
            handleError('Server did not return an User');
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), user: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config), user: null };
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
        const { data } = await axios.get<User>(`${url}/${id}`);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const getByToken = async (token: string) => {
    try {
        const { data } = await axios.get<User>(`${url}/me`, authConfig(token));
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const update = async (user: User, token: string, config: Config): Promise<UserResponse> => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...reqBody } = user;
        const res = await axios.put<User>(`${url}/${user.id}`, reqBody, authConfig(token));
        const updatedUser = res.data;

        if (updatedUser) {
            return { success: true, message: contentToText(ContentID.userUpdated, config), user: updatedUser };
        } else {
            handleError(new Error('Server did not return a User object'));
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), user: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config), user: null };
    }
};

export default {
    addNew,
    getAll,
    getById,
    getByToken,
    update,
};
