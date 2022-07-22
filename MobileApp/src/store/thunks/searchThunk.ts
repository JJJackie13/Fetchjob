import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from 'redux';
import { loadPreSearchUser } from '../actions/searchActions';




// export function fetchNavBarSearch(input: string | undefined){
//     return async (dispatch: Dispatch) => {
//         try {
//             const res = await fetch(`${API_URL}/search?keywords=${input}`, {
//                 headers: {
//                     Authorization: `Bearer ${await AsyncStorage.getItem(
//                         'token',
//                     )}`,
//                 },
//             });

//             const preSearchRes = await res.json();

//             const companies = preSearchRes[0].data;
//             const users = preSearchRes[1].data;
//             const jobs = preSearchRes[2].data;

//         } catch (error) {
            
//         }
//     }
// }