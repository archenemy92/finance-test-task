import {Dispatch} from "redux"
import {getDataApi, TickersDataType} from "../api/api"
import {ThunkType} from "./store"

export type FinanceDataReducerStateType = {
    data: TickersDataType[]
    isFetchData: boolean
    ticker: string
    interval: string
}
export type DataReceivedActionType = ReturnType<typeof dataReceived>
export type DeleteTickerActionType = ReturnType<typeof deleteTicker>
export type SetIsFetchingActionType = ReturnType<typeof setIsFetching>
export type SetTickerTitleActionType = ReturnType<typeof setTickerTitle>
export type SetIntervalUpdateActionType = ReturnType<typeof setIntervalUpdate>

export type FinanceReducerActionTypes =
    DataReceivedActionType
    | DeleteTickerActionType
    | SetIsFetchingActionType
    | SetTickerTitleActionType
    | SetIntervalUpdateActionType


const initState: FinanceDataReducerStateType = {
    isFetchData: false,
    data: [],
    ticker: "",
    interval: "5"
}

export const financeDataReducer = (state = initState, action: FinanceReducerActionTypes) => {
    switch (action.type) {
        case "SET_DATA_FINANCE___FINANCE-REDUCER":
            let newData = action.data.map(el => {
                let prevPrice
                if (state.data.length !== 0) {
                    prevPrice = state.data.find(obj => {
                        return el.ticker === obj.ticker
                    })
                }
                el.price = {prev: prevPrice?.price?.current || "0", current: el.price}
                return el
            })
            return {
                ...state,
                data: newData
            }
        case "DELETE_TICKER___FINANCE-REDUCER":
            return {
                ...state,
                data: state.data.filter(el => el.ticker !== action.ticker)
            }
        case "SET_IS-FETCHING___FINANCE-REDUCER":
            return {
                ...state,
                isFetchData: action.value
            }
        case "SET_TICKER_TITLE___FINANCE-REDUCER":
            return {
                ...state,
                ticker: action.title
            }
        case "SET_INTERVAL_UPDATE___FINANCE-REDUCER":
            return {
                ...state,
                interval: action.interval
            }
        default:
            return state
    }
}

export const dataReceived = (data: TickersDataType[]) => {
    return {
        type: "SET_DATA_FINANCE___FINANCE-REDUCER",
        data
    } as const
}
export const deleteTicker = (ticker: string) => {
    return {
        type: "DELETE_TICKER___FINANCE-REDUCER",
        ticker
    } as const
}

export const setIsFetching = (value: boolean) => {
    return {
        type: "SET_IS-FETCHING___FINANCE-REDUCER",
        value
    } as const
}

export const setTickerTitle = (title: string) => {
    return {
        type: "SET_TICKER_TITLE___FINANCE-REDUCER",
        title
    } as const
}
export const setIntervalUpdate = (interval: string) => {
    return {
        type: "SET_INTERVAL_UPDATE___FINANCE-REDUCER",
        interval
    } as const
}

let _dataHandler: ((data: TickersDataType[]) => void) | null = null

 const dataHandler = (dispatch: Dispatch) => {
    if (_dataHandler === null) {
        _dataHandler = (data: TickersDataType[]) => {
            dispatch(dataReceived(data))
        }
    }
    return _dataHandler
}

export const getFinanceData = (): ThunkType =>
    async (dispatch) => {
        getDataApi.start()
        getDataApi.subscribeNewData(dataHandler(dispatch))
    }

export const deleteTick = (tickerTitle: string): ThunkType =>
    async (dispatch) => {
        getDataApi.delTicker(tickerTitle)
        dispatch(deleteTicker(tickerTitle))
    }

export const addTicker = (tickerTitle: string, interval: string): ThunkType => async (dispatch) => {
    let sec = interval + "000"
    dispatch(setIsFetching(true))
    getDataApi.addTicker(tickerTitle)
    //imitate delay for disabled send button
    setTimeout(() => {
        dispatch(setIsFetching(false))
    }, +sec)

}
export const changeInterval = (sec: string): ThunkType => async () => {
    getDataApi.changeInterval(sec)
}
export const deleteChannel = (): ThunkType => async () => {
    getDataApi.stop()
}