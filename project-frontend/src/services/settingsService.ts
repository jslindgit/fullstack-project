import { Config } from '../types/configTypes';
import { Settings } from '../types/settingsTypes';
import { StoreDispatch } from '../redux/store';
import { Response } from '../types/types';

import { handleError } from '../util/handleError';

import { settingsAdd, settingsUpdate } from '../redux/slices/settingsSlice';

interface SettingsResponse extends Response {
    settings: Settings | null;
}

const updateSettings = async (currentSettings: Settings, newSettings: Settings, storeDispatch: StoreDispatch, config: Config): Promise<SettingsResponse> => {
    const res: SettingsResponse = currentSettings.id
        ? await storeDispatch(settingsUpdate.initiate({ currentSettingsId: currentSettings.id, newSettings: newSettings, config: config })).unwrap()
        : await storeDispatch(settingsAdd.initiate({ toAdd: newSettings, config: config })).unwrap();

    if (!res.success || !res.settings) {
        handleError(new Error('Failed to update settings.'));
    }

    return res;
};

export default {
    updateSettings,
};
