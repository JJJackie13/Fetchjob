import { IPreSearchUserActions, PreSearchUser } from "../actions/searchActions"
import { IPreSearchUserState } from "../states/searchState"
import produce from "immer"

const initialUserState:IPreSearchUserState = {
    users: { }
}

const initialCompanyState = {
    companies: { }
}

const initialJobState = {
    jobs: { }
}

export function preSearchUserReducer(
    state: IPreSearchUserState = initialUserState,
    action: IPreSearchUserActions
): IPreSearchUserState {

    return produce(state, state => {   
        if (action.type === '@@searchBar/PreSearchUser'){
            for(let user of action.users) {
                state.users[user.id] = user
            }
        }
    })
    
}