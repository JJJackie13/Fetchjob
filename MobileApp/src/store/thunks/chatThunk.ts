import {API_URL} from '@env';
// import {Dispatch} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function fetchLastChatHistories() {
    return async () => {
        try {
            const res = await fetch(`${API_URL}/chat/history/last`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                let data = await res.json();
                // console.log(data);
                return data;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };
}
export function fetchAllChatHistories() {
    return async () => {
        try {
            const res = await fetch(`${API_URL}/chat/history/all`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                let parseRes = await res.json();
                return parseRes.data;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };
}
