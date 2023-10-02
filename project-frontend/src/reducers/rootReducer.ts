import { combineReducers } from 'redux';
import categoryReducer, { CategoryState } from './categoryReducer';
import configReducer, { ConfigState } from './configReducer';
import miscReducer, { MiscState } from './miscReducer';
import usersReducer, { UsersState } from './usersReducer';

export interface RootState {
    categories: CategoryState;
    config: ConfigState;
    misc: MiscState;
    users: UsersState;
}

const rootReducer = combineReducers({
    categories: categoryReducer,
    config: configReducer,
    misc: miscReducer,
    users: usersReducer,
});

export default rootReducer;
