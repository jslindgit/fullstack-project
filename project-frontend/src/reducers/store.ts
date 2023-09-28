import { configureStore } from '@reduxjs/toolkit';

import rootReducer from '../reducers/root_reducer.ts';

const store = configureStore({
    reducer: rootReducer,
});

export default store;
