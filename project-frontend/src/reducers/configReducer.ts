import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { Config } from '../types/configTypes';
import { Language } from '../types/languageTypes';
import { Settings } from '../types/types';

import { isConfig } from '../types/configTypes';
import { defaultConfig } from '../constants';

export type ConfigState = Config;

const slice = createSlice({
    name: 'config',
    initialState: defaultConfig,
    reducers: {
        setConfig(_state: ConfigState, action: PayloadAction<Config>) {
            return action.payload;
        },
        setLanguage(state: ConfigState, action: PayloadAction<Language>) {
            state.language = action.payload;
        },
    },
});

export const initializeConfig = (dispatch: Dispatch<AnyAction>, settings: Settings | null) => {
    const storedConfigString = localStorage.getItem('config');
    const parsedConfig = storedConfigString ? JSON.parse(storedConfigString) : null;

    if (parsedConfig) {
        if (isConfig(parsedConfig)) {
            // prettier-ignore
            const finalConfig: Config = settings
                ? {
                    ...parsedConfig,
                    store: {
                        ...parsedConfig.store,
                        contactCity: settings.storeContactCity,
                        contactCountry: settings.storeContactCountry,
                        contactEmail: settings.storeContactEmail,
                        contactPhone: settings.storeContactPhone,
                        contactZipcode: settings.storeContactZipcode,
                        deliveryCountries: settings.storeDeliveryCountries,
                        deliveryTimeBusinessDays: settings.storeDeliveryTimeBusinessDays,
                        description: settings.storeDescription,
                        contactName: settings.storeName,
                        welcome: settings.storeWelcome,
                    },
                }
                : parsedConfig;
            dispatch(slice.actions.setConfig(finalConfig));
        } else {
            saveConfigToLocalStorage(defaultConfig);
            dispatch(slice.actions.setConfig(defaultConfig));
        }
    }
};

export const saveConfigToLocalStorage = (state: ConfigState) => {
    localStorage.setItem('config', JSON.stringify(state));
};

export const { setConfig, setLanguage } = slice.actions;
export default slice.reducer;
