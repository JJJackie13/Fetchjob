export interface PreSearchCompany {
    id: number,
    compname: string,
    industname: string,
    avatar?: string
}

export interface PreSearchUser {
    id: number,
    first_name: string,
    last_name: string,
    headline: string,
    industname: string,
    avatar: string
}

export interface PreSearchJob {
    id: number,
    compname: string,
    industname: string,
    location: string,
    avatar?: string,
    created_at: number
}

export function loadPreSearchCompany(
    companies: PreSearchCompany[]
){
    return {
        type: '@@searchBar/PreSearchCompany' as const,
        companies
    }
}

export function loadPreSearchUser(
    users: PreSearchUser[]
){
    return {
        type: '@@searchBar/PreSearchUser' as const,
        users
    }
}

export function loadPreSearchJob(
    jobs: PreSearchJob[]
){
    return {
        type: '@@searchBar/PreSearchJob' as const,
        jobs
    }
}

export function noSearchResult(type: NO_RESULT){
    return {
        type: type
    }
}

type NO_RESULT = 'NO_MATCHES_FOUND';

export type IPreSearchCompanyActions = ReturnType<typeof loadPreSearchCompany>
                                
export type IPreSearchUserActions = ReturnType<typeof loadPreSearchUser>

export type IPreSearchJobActions = ReturnType<typeof loadPreSearchJob>