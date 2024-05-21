import { configureStore } from '@reduxjs/toolkit';

//import rootReducer from './rootReducer.ts';
import configReducer from './configReducer.ts';
import miscReducer from './miscReducer.ts';
import orderReducer from './orderReducer.ts';
import userReducer from './userReducer.ts';

import { apiSlice } from '../services/apiSlice.ts';

import { saveConfigToLocalStorage } from './configReducer.ts';
import { saveOrderToLocalStorage } from './orderReducer.ts';
import { saveTokenToLocalStorage } from './userReducer.ts';

const store = configureStore({
    reducer: { config: configReducer, misc: miscReducer, order: orderReducer, user: userReducer, [apiSlice.reducerPath]: apiSlice.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
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
