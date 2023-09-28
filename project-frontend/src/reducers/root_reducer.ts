import { combineReducers } from 'redux';
import testReducer, { TestState } from './test_reducer';

export interface RootState {
    test: TestState;
}

const rootReducer = combineReducers({
    test: testReducer,
});

export default rootReducer;
