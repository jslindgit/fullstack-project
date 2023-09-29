import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Config } from '../types/types';
import { defaultConfig } from '../constants';

export type ConfigState = Config;

const slice = createSlice({
    name: 'config',
    initialState: defaultConfig,
    reducers: {
        setConfig(_state: ConfigState, action: PayloadAction<Config>) {
            return action.payload;
        },
    },
});

export const { setConfig } = slice.actions;
export default slice.reducer;
