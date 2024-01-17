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
                    owner: {
                        ...parsedConfig.owner,
                        businessIdentifier: settings.ownerBusinessIdentifier,
                        email: settings.ownerEmail,
                        name: settings.ownerName,
                        phone: settings.ownerPhone
                    },
                    store: {
                        ...parsedConfig.store,
                        contactCity: settings.storeContactCity,
                        contactCountry: settings.storeContactCountry,
                        contactEmail: settings.storeContactEmail,
                        contactName: settings.storeName,
                        contactPhone: settings.storeContactPhone,
                        contactStreetAddress: settings.storeContactStreetAddress,
                        contactZipcode: settings.storeContactZipcode,
                        deliveryCountries: settings.storeDeliveryCountries,
                        deliveryTimeBusinessDays: settings.storeDeliveryTimeBusinessDays,
                        welcome: settings.storeWelcome,
                    },
                    vat: Number(settings.vat)
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
