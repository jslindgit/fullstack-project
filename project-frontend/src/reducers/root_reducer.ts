import { combineReducers } from 'redux';
import categoryReducer, { CategoryState } from './category_reducer';
import configReducer, { ConfigState } from './config_reducer';
import usersReducer, { UsersState } from './users_reducer';

export interface RootState {
    categories: CategoryState;
    config: ConfigState;
    users: UsersState;
}

const rootReducer = combineReducers({
    categories: categoryReducer,
    config: configReducer,
    users: usersReducer,
});

export default rootReducer;
