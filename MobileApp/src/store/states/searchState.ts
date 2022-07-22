import { PreSearchCompany, PreSearchJob, PreSearchUser } from "../actions/searchActions";

export interface IPreSearchCompanyState {
    companies: {
        [id: string]: PreSearchCompany
    }
}

export interface IPreSearchUserState {
    users: {
        [id: string]: PreSearchUser
    }
}

export interface IPreSearchJobState {
    jobs: {
        [id: string]: PreSearchJob
    }
}