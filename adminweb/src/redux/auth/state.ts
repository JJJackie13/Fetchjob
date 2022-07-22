import { JWTPayload } from '../../shared';

export type AuthState = {
    isAuthenticated: boolean | null;
    user: JWTPayload | null;
    errorMessage: string | null;
    isLoading: boolean;
};


