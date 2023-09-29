import { combineReducers } from 'redux';
import categoryReducer, { CategoryState } from './category_reducer';
import configReducer, { ConfigState } from './config_reducer';
import miscReducer, { MiscState } from './misc_reducer';
import usersReducer, { UsersState } from './users_reducer';

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
