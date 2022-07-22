import { isLoading, loginFailure, loginSuccess, logoutSuccess } from './action';
import { RootThunkDispatch } from '../thunk';
import { History } from 'history';
import jwtDecode from 'jwt-decode';
import { authMessages, JWTPayload, LoginInput } from '../../shared';
// import { socket } from '../../hooks/socketio';



export function loginThunk({ email, password }: LoginInput, history: History) {
    return async (dispatch: RootThunkDispatch) => {
        dispatch(isLoading());
        try {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json();

            // duplicated with trycatch?
            if (res.status !== 200 || !json.token) {
                dispatch(loginFailure(json.error));
                return;
            }
            localStorage.setItem('token', json.token);
            const payload: JWTPayload = jwtDecode(json.token);
            dispatch(loginSuccess(payload));

            // const user_id = payload.user_id;
            // socket.emit('newRoom', user_id.toString());

            // if (
            //     // !process.env.REACT_APP_USERS_CIFU ||
            //     // !process.env.REACT_APP_USERS_CLIENT ||
            //     !process.env.REACT_APP_USERS_ADMIN
            // ) {
            //     throw new Error('missing env');
            // }

            // switch (payload.user_type_id) {
            //     case parseInt(process.env.REACT_APP_USERS_CIFU): {
            //         history.push('/cifu/repair');
            //         break;
            //     }
            //     case parseInt(process.env.REACT_APP_USERS_CLIENT): {
            //         history.push('/client/service');
            //         break;
            //     }
            //     case parseInt(process.env.REACT_APP_USERS_ADMIN): {
            //         history.push('/admin/home');
            //         break;
            //     }
            // }

            if (payload.is_admin) {
                history.push('/Dashboard');
            }
        } catch (error) {
            dispatch(loginFailure(error as string));
        }
    };
}


export function logoutThunk() {
    return async (dispatch: RootThunkDispatch) => {
        dispatch(isLoading());
        localStorage.removeItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_SERVER}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await res.json();
        if (result.message) {
            dispatch(logoutSuccess());
        }
        return;
    };
}





export function checkUserStatus(history: History) {
    return async (dispatch: RootThunkDispatch) => {
        // debugger
        dispatch(isLoading());

        const token = localStorage.getItem('token');

        if (token === null) {
            dispatch(logoutSuccess());
            return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_SERVER}/user/current_user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const json = await res.json();
        if (json.data.id) {
            const payload: JWTPayload = jwtDecode(token);
            dispatch(loginSuccess(payload));
            // history.push('/Dashboard');

            // const user_id = payload.user_id;
            // socket.emit('newRoom', user_id.toString());
        } else {
            dispatch(loginFailure(authMessages.failure));
        }
    };
}
