import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {IAuthState} from './states/authState';
import {IAuthActions} from './actions/authActions';
import {authReducer} from './reducers/authReducer';
import {IUserState} from './states/userState';
import {IUserActions} from './actions/userActions';
import {userReducer} from './reducers/userReducer';
// REDUX THUNK
import thunk, {ThunkDispatch} from 'redux-thunk';
import { IPreSearchUserState } from './states/searchState';
import { preSearchUserReducer } from './reducers/searchReducer';
import { IPreSearchUserActions } from './actions/searchActions';

export interface IRootState {
    auth: IAuthState;
    user: IUserState;
    preSearchUser: IPreSearchUserState
}
type IRootAction = IAuthActions | IUserActions | IPreSearchUserActions;
export type IRootThunkDispatch = ThunkDispatch<IRootState, null, IRootAction>;
const rootReducer = combineReducers<IRootState>({
    auth: authReducer,
    user: userReducer,
    preSearchUser: preSearchUserReducer
});
export default createStore<IRootState, IRootAction, {}, {}>(
    rootReducer,
    compose(applyMiddleware(thunk)),
);
