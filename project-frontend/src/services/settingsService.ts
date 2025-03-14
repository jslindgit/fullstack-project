import { AnyAction, Dispatch } from '@reduxjs/toolkit';

import { Config, Settings } from '../types/configTypes';
import { StoreDispatch } from '../redux/store';
import { Response } from '../types/types';

import { handleError } from '../util/handleError';

import { initializeConfig } from '../redux/configReducer';
import { settingsAdd, settingsGetAll, settingsUpdate } from '../redux/slices/settingsSlice';

interface SettingsResponse extends Response {
    settings: Settings | null;
}

const fetchCurrentSettings = async (storeDispatch: StoreDispatch): Promise<Settings | null> => {
    const allSettings = await storeDispatch(settingsGetAll.initiate()).unwrap();
    return allSettings.length > 0 ? allSettings[0] : null;
};

const updateSettings = async (settings: Settings, dispatch: Dispatch<AnyAction>, storeDispatch: StoreDispatch, config: Config): Promise<SettingsResponse> => {
    const currentSettings = await fetchCurrentSettings(storeDispatch);

    const res: SettingsResponse = currentSettings
        ? await storeDispatch(settingsUpdate.initiate({ currentSettings: currentSettings, newSettings: settings, config: config })).unwrap()
        : await storeDispatch(settingsAdd.initiate({ toAdd: settings, config: config })).unwrap();

    if (res.success && res.settings) {
        initializeConfig(dispatch, res.settings);
    } else {
        handleError(new Error('Failed to update settings.'));
    }

    return res;
};

export default {
    fetchCurrentSettings,
    updateSettings,
};
