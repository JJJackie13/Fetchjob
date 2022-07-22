import { JWTPayload } from '../../shared';

export function loginSuccess(payload: JWTPayload) {
    return {
        type: '@@auth/LOGIN_SUCCESS' as const,
        payload,
    };
}
export function loginFailure(message: string) {
    return {
        type: '@@auth/LOGIN_FAILURE' as const,
        message,
    };
}
export function logoutSuccess() {
    return {
        type: '@@auth/LOGOUT_SUCCESS' as const,
    };
}

export function isLoading() {
    return {
        type: '@@auth/LOADING' as const,
    };
}

export type AuthAction =
    | ReturnType<typeof loginSuccess>
    | ReturnType<typeof loginFailure>
    | ReturnType<typeof logoutSuccess>
    | ReturnType<typeof isLoading>;
