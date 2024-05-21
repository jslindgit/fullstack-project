import { combineReducers } from 'redux';

import configReducer from './configReducer';
import miscReducer from './miscReducer';
import orderReducer from './orderReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    config: configReducer,
    misc: miscReducer,
    order: orderReducer,
    user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
