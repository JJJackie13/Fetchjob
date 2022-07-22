export type JWTPayload = {
    id: number;
    email: string;
    name: string;
    avatar: string;
    banner: string;
    is_admin: boolean;
    updated_at: string;
};
export interface IAuthState {
    isAuth: boolean;
    user?: JWTPayload;
    error?: string;
}
