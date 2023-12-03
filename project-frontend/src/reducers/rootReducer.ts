import { combineReducers } from 'redux';

import categoryReducer, { CategoryState } from './categoryReducer';
import configReducer, { ConfigState } from './configReducer';
import miscReducer, { MiscState } from './miscReducer';
import shoppingCartReducer, { ShoppingCartState } from './shoppingCartReducer';
import userReducer, { UserState } from './userReducer';

export interface RootState {
    categories: CategoryState;
    config: ConfigState;
    misc: MiscState;
    shoppingCart: ShoppingCartState;
    user: UserState;
}

const rootReducer = combineReducers({
    categories: categoryReducer,
    config: configReducer,
    misc: miscReducer,
    shoppingCart: shoppingCartReducer,
    user: userReducer,
});

export default rootReducer;
