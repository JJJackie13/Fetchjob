import { RouterState } from 'connected-react-router';
import { AuthState } from './auth/state';

export type IRootState = {
    router: RouterState;
    auth: AuthState;
};

