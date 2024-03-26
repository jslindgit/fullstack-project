import { combineReducers } from 'redux';

import configReducer, { ConfigState } from './configReducer';
import miscReducer, { MiscState } from './miscReducer';
import orderReducer, { OrderState } from './orderReducer';
import userReducer, { UserState } from './userReducer';

export interface RootState {
    config: ConfigState;
    misc: MiscState;
    order: OrderState;
    user: UserState;
}

const rootReducer = combineReducers({
    config: configReducer,
    misc: miscReducer,
    order: orderReducer,
    user: userReducer,
});

export default rootReducer;
