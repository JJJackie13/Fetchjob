export function loadToken(token: string) {
    return {
        type: '@Auth/load_token' as const,
        token: token,
    };
}
export function removeToken() {
    return {
        type: '@Auth/remove_token' as const,
    };
}
export function loginSuccess() {
    return {
        type: 'LOGIN' as const,
    };
}
export function logoutSuccess() {
    return {
        type: 'LOGOUT' as const,
    };
}
export function failed(type: FAILED_INTENT, message: string) {
    return {
        type: type,
        error: message,
    };
}

type FAILED_INTENT = 'LOGIN_FAILED' | 'REGISTER_FAILED';

export type IAuthActions =
    | ReturnType<typeof loadToken>
    | ReturnType<typeof removeToken>
    | ReturnType<typeof loginSuccess>
    | ReturnType<typeof logoutSuccess>
    | ReturnType<typeof failed>;
