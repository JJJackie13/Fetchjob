import jwt_decode from 'jwt-decode';
import {IAuthState, JWTPayload} from '../states/authState';
import {IAuthActions} from '../actions/authActions';
const initialState = {
    isAuth: false,
    user: undefined,
    error: undefined,
};
export function authReducer(
    state: IAuthState = initialState,
    action: IAuthActions,
) {
    switch (action.type) {
        case '@Auth/load_token':
            try {
                let payload: JWTPayload = jwt_decode(action.token);
                // console.log(payload);
                return {
                    isAuth: true,
                    user: payload,
                    error: undefined,
                };
            } catch (error) {
                return {
                    isAuth: false,
                    error: 'invalid Token',
                    user: undefined,
                };
            }
        case '@Auth/remove_token':
            return {
                isAuth: false,
                user: undefined,
                error: undefined,
            };
        case 'LOGOUT':
            return {
                isAuth: false,
                user: undefined,
                error: undefined,
            };
        case 'LOGIN_FAILED':
            return {
                isAuth: false,
                error: action.error,
                user: undefined,
            };
        case 'REGISTER_FAILED':
            return {
                isAuth: false,
                error: action.error,
                user: undefined,
            };
        default:
            return state;
    }
}
