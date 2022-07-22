import { AuthAction } from './action';
import { AuthState } from './state';

const initialState: AuthState = {
    isAuthenticated: null,
    user: null,
    errorMessage: null,
    isLoading: true,
};

export const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case '@@auth/LOGIN_SUCCESS': {
            console.log(`reducer reached with payload: ${JSON.stringify(action.payload)}`);

            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                isLoading: false,
            };
        }

        case '@@auth/LOGIN_FAILURE': {
            return {
                ...state,
                isAuthenticated: false,
                errorMessage: action.message,
                isLoading: false,
            };
        }

        case '@@auth/LOGOUT_SUCCESS': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                isLoading: false,
            };
        }

        case '@@auth/LOADING': {
            return {
                ...state,
                isAuthenticated: false,
                isLoading: true,
                errorMessage: null,
            };
        }
        default:
            return state;
    }
};
