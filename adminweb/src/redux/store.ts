import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import logger from 'redux-logger';
import { IRootState } from './state';
import { IRootAction } from './actions';
import {
    RouterState,
    connectRouter,
    routerMiddleware,
    CallHistoryMethodAction
} from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import { rootReducer } from "./reducer";

export const history = createBrowserHistory();

declare global {
    /* tslint:disable:interface-name */
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore<IRootState, IRootAction, {}, {}>(
    rootReducer,
    composeEnhancers(

        applyMiddleware(routerMiddleware(history)),
        applyMiddleware(thunk),
        applyMiddleware(logger),
    )
);

export default store;