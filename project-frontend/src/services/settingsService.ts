import axios from 'axios';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

import { Settings } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import { authConfig, settingsFromResBody, settingsToReqBody } from '../util/serviceProvider';

import { initializeConfig } from '../reducers/configReducer';

interface SettingsResponse extends Response {
    settings: Settings | null;
}

const url = apiBaseUrl + '/settings';

const get = async (): Promise<Settings | null> => {
    const all = await getAll();
    return all.length > 0 ? all[0] : null;
};

const getAll = async (): Promise<Settings[]> => {
    try {
        const { data } = await axios.get<Settings[]>(url);
        const result: Settings[] = [];
        data.forEach((s) => {
            if (s) {
                const category = settingsFromResBody(s);
                if (category) {
                    result.push(category);
                }
            }
        });
        return result;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const update = async (settings: Settings, token: string, dispatch: Dispatch<AnyAction>): Promise<SettingsResponse> => {
    try {
        const res = await axios.put<Settings>(`${url}/${settings.id}`, settingsToReqBody(settings), authConfig(token));
        const updatedSettings = settingsFromResBody(res.data);

        if (updatedSettings) {
            await initializeConfig(dispatch);
            return { success: true, message: 'Category updated.', addedCategory: categoryFromResBody(updatedCategory) };
        } else {
            handleError(new Error('Server did not return a Category object.'));
            return { success: false, message: 'Something went wrong, try again later.', addedCategory: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred.', addedCategory: null };
    }
};

export default {
    get,
    update,
};
