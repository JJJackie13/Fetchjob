import { CallHistoryMethodAction } from 'connected-react-router';
import { AuthAction } from './auth/action';
// import { DataAction } from './data/action';


export type IRootAction =
    | AuthAction
    | CallHistoryMethodAction
    // | DataAction
