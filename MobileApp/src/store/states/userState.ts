import {UserProfileProps} from '../../types/types';

export interface IUserState {
    info?: UserProfileProps;
    hobbies?: [];
    skills?: [];
    numberOfConnections?: number;
    relationship?: string;
}
