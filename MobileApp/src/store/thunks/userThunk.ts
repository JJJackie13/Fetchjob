import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from 'redux';

import {failed, loadedUser, reset} from '../actions/userActions';

export function fetchUserById(userId: number | undefined) {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(reset());
            if (!userId) {
                dispatch(failed('FAILED_FETCH_USER'));
            }
            const res = await fetch(`${API_URL}/user/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                // console.log(parseRes);
                const {
                    hobbies,
                    profile,
                    skills,
                    numberOfConnections,
                    relationship,
                } = parseRes.data;
                dispatch(
                    loadedUser(
                        profile,
                        hobbies,
                        skills,
                        numberOfConnections,
                        relationship,
                    ),
                );
                return true;
            } else {
                console.log(parseRes);
                dispatch(failed('FAILED_FETCH_USER'));
                return false;
            }
        } catch (error) {
            dispatch(failed('FAILED_FETCH_USER'));
            return false;
        }
    };
}
