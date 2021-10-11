import {applyMiddleware} from "redux"
import {combineReducers} from "redux"
import {createStore} from "redux"
import thunk, {ThunkAction} from "redux-thunk"
import {appReducer} from "./appReducer"
import {financeDataReducer} from "./financeDataReducer"


export type AppStateType = ReturnType<typeof rootReducer>
export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, any>


const rootReducer = combineReducers({
    app: appReducer,
    finance: financeDataReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))
//@ts-ignore
window.store = store.getState()