import { combineReducers } from 'redux';

import categoryReducer, { CategoryState } from './categoryReducer';
import configReducer, { ConfigState } from './configReducer';
import miscReducer, { MiscState } from './miscReducer';
import orderReducer, { OrderState } from './orderReducer';
import userReducer, { UserState } from './userReducer';

export interface RootState {
    categories: CategoryState;
    config: ConfigState;
    misc: MiscState;
    order: OrderState;
    user: UserState;
}

const rootReducer = combineReducers({
    categories: categoryReducer,
    config: configReducer,
    misc: miscReducer,
    order: orderReducer,
    user: userReducer,
});

export default rootReducer;
