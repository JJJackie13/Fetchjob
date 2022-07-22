import {Dispatch} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadToken, logoutSuccess, failed} from '../actions/authActions';
import {API_URL} from '@env';
import {Socket} from 'socket.io-client';

export function login(email: string, password: string) {
    return async (dispatch: Dispatch) => {
        try {
            // console.log(API_URL, email, password);
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const parseRes = await res.json();
            // console.log(parseRes);
            // console.log(res.status);
            if (res.status !== 200) {
                dispatch(failed('LOGIN_FAILED', parseRes.message));
                return {success: false, message: parseRes.message};
            } else {
                await AsyncStorage.setItem('token', parseRes.token);
                dispatch(loadToken(parseRes.token)); // dispatch(loginSuccess());
                return {success: true};
            }
        } catch (error: any) {
            dispatch(failed('LOGIN_FAILED', error.toString()));
            return {success: false};
        }
    };
}
export function register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}) {
    return async (dispatch: Dispatch) => {
        try {
            const {email, password, first_name, last_name} = data;
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    first_name,
                    last_name,
                }),
            });
            const parseRes = await res.json();
            // console.log(parseRes);
            // console.log(res.status);
            if (res.status !== 200) {
                dispatch(failed('REGISTER_FAILED', parseRes.message));
                return false;
            } else {
                login(email, password)(dispatch);
                return true;
            }
        } catch (error: any) {
            dispatch(failed('REGISTER_FAILED', error.toString()));
            return false;
        }
    };
}
export function logout(socket: Socket) {
    return async (dispatch: Dispatch) => {
        try {
            await AsyncStorage.removeItem('token');

            dispatch(logoutSuccess());
            await fetch(`${API_URL}/auth/logout`);
            socket.disconnect();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
}
