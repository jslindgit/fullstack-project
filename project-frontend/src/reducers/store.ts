import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './rootReducer.ts';

import { saveConfigToLocalStorage } from './configReducer.ts';
import { saveOrderToLocalStorage } from './orderReducer.ts';
import { saveTokenToLocalStorage } from './userReducer.ts';

const store = configureStore({
    reducer: rootReducer,
});

let previousState = store.getState();

// Save certain parts of the state to localStorage to make them persistant:
store.subscribe(() => {
    const currentState = store.getState();

    if (currentState.config !== previousState.config) {
        saveConfigToLocalStorage(currentState.config);
    }
    if (currentState.order !== previousState.order) {
        saveOrderToLocalStorage(currentState.order);
    }
    if (currentState.user !== previousState.user) {
        saveTokenToLocalStorage(currentState.user);
    }

    previousState = currentState;
});

export default store;
