export function failed(type: FAILED_INTENT) {
    return {
        type: type,
    };
}
export function reset() {
    return {
        type: 'user/reset',
    };
}

export function loadedUser(
    profile: {},
    hobbies: [],
    skills: [],
    numberOfConnections: number,
    relationship: string,
) {
    return {
        type: 'user/loaded',
        info: profile,
        hobbies,
        skills,
        numberOfConnections,
        relationship,
    };
}

type FAILED_INTENT = 'FAILED_FETCH_USER';

export type IUserActions =
    | ReturnType<typeof failed>
    | ReturnType<typeof loadedUser>;
