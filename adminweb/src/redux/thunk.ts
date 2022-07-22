import { ThunkDispatch } from 'redux-thunk'
import { IRootAction } from './actions'
import { IRootState } from './state'
export type RootThunkDispatch = ThunkDispatch<IRootState, null, IRootAction>