import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { history } from './history';
import { authReducer } from './auth/reducer';


export let rootReducer = combineReducers({
    router: connectRouter(history),
    auth: authReducer,
});


