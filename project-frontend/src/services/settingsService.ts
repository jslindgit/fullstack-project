import axios from 'axios';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

import { Settings } from '../types/configTypes';
import { Response } from '../types/types';

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
                const settings = settingsFromResBody(s);
                if (settings) {
                    result.push(settings);
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
        let updatedSettings: Settings | null = null;

        const currentSettings = await get();
        if (currentSettings) {
            const res = await axios.put<Settings>(`${url}/${currentSettings.id}`, settingsToReqBody(settings), authConfig(token));
            updatedSettings = settingsFromResBody(res.data);
        } else {
            const res = await axios.post<Settings>(url, settingsToReqBody(settings), authConfig(token));
            updatedSettings = settingsFromResBody(res.data);
        }

        if (updatedSettings) {
            initializeConfig(dispatch, updatedSettings);
            return { success: true, message: 'Settings updated.', settings: updatedSettings };
        } else {
            handleError(new Error('Server did not return a Settings object.'));
            return { success: false, message: 'Something went wrong, try again later.', settings: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred.', settings: null };
    }
};

export default {
    get,
    update,
};
