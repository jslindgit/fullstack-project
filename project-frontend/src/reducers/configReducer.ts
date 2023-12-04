import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { Config } from '../types/configTypes';
import { Language } from '../types/languageTypes';

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

export const initializeConfig = (dispatch: Dispatch<AnyAction>) => {
    const storedConfigString = localStorage.getItem('config');

    const config = storedConfigString ? JSON.parse(storedConfigString) : defaultConfig;
    dispatch(slice.actions.setConfig(config));
};

export const saveConfigToLocalStorage = (state: ConfigState) => {
    localStorage.setItem('config', JSON.stringify(state));
};

export const { setConfig, setLanguage } = slice.actions;
export default slice.reducer;
