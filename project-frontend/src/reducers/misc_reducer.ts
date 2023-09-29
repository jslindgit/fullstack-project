import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Notification, NewNotification } from '../types/types';

export interface MiscState {
    notification: Notification | null;
    previousLocation: string;
}

const initialState: MiscState = {
    notification: null,
    previousLocation: '/',
};

const slice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setNotification(state: MiscState, action: PayloadAction<NewNotification>) {
            state.notification = { ...action.payload, renders: 1 };
        },
        setPreviousLocation(state: MiscState, action: PayloadAction<string>) {
            state.previousLocation = action.payload;
        },
        tickNotification(state: MiscState, _action: PayloadAction) {
            if (state.notification) {
                state.notification.renders--;

                if (state.notification.renders <= 0) {
                    state.notification = null;
                }
            }
        },
    },
});

export const { setNotification, setPreviousLocation, tickNotification } = slice.actions;
export default slice.reducer;
