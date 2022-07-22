import {IUserActions} from '../actions/userActions';
import {IUserState} from '../states/userState';

const initialState = {
    info: undefined,
    hobbies: undefined,
    skills: undefined,
    numberOfConnections: undefined,
    relationship: undefined,
};

export function userReducer(
    state: IUserState = initialState,
    action: IUserActions,
) {
    switch (action.type) {
        case 'FAILED_FETCH_USER':
            return {
                info: undefined,
                hobbies: undefined,
                skills: undefined,
                numberOfConnections: undefined,
                relationship: undefined,
            };
        case 'user/reset':
            return {
                info: undefined,
                hobbies: undefined,
                skills: undefined,
                numberOfConnections: undefined,
                relationship: undefined,
            };
        case 'user/loaded':
            return {
                ...state,
                info: action.info,
                hobbies: action.hobbies,
                skills: action.skills,
                numberOfConnections: action.numberOfConnections,
                relationship: action.relationship,
            };
        default:
            return state;
    }
}
