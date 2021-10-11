import {
    dataReceived,
    deleteTicker,
    financeDataReducer,
    FinanceDataReducerStateType,
    setIsFetching
} from "./financeDataReducer"
import {TickersDataType} from "../api/api"

let startState: FinanceDataReducerStateType = {
    data: [
        {
            change: "146.85",
            change_percent: "0.88",
            dividend: "0.46",
            exchange: "NASDAQ",
            id: "0c39ea50-2a5d-11ec-b9c2-d5c6844d42d5",
            last_trade_time: "2021-10-11T03:32:46.000Z",
            price: "159.91",
            ticker: "AAPL",
            yield: "0.51",
        },
        {
            change: "106.79",
            change_percent: "0.05",
            dividend: "0.20",
            exchange: "NASDAQ",
            id: "65b1d0c1-2a5d-11ec-b9c2-d5c6844d42d5",
            last_trade_time: "2021-10-11T03:35:16.000Z",
            price: "190.98",
            ticker: "GOOGL",
            yield: "0.39"
        }
    ],
    isFetchData: false
}

test("Correct tickers will be set into state", () => {

    let dataFromServer: TickersDataType[] = [
        {
            change: "96.95",
            change_percent: "0.46",
            dividend: "0.20",
            exchange: "NASDAQ",
            id: "558eb130-2a5e-11ec-b9c2-d5c6844d42d5",
            last_trade_time: "2021-10-11T03:41:59.000Z",
            price: "242.68",
            ticker: "AAPL",
            yield: "1.49"
        },
        {
            change: "111.87",
            change_percent: "0.54",
            dividend: "0.23",
            exchange: "NASDAQ",
            id: "24754e51-2a5f-11ec-b9c2-d5c6844d42d5",
            last_trade_time: "2021-10-11T03:47:46.000Z",
            price: "193.93",
            ticker: "GOOGL",
            yield: "0.23"
        }
    ]

    const endState = financeDataReducer(startState,
        dataReceived(dataFromServer)
    )

    expect(endState.isFetchData).toBeFalsy()
    expect(endState.data.length).toBe(2)
    expect(endState.data[0].ticker).toBe("AAPL")
    expect(endState.data[1].ticker).toBe("GOOGL")
    expect(endState.data[0].id).toBe(dataFromServer[0].id)
    expect(endState.data[1].id).toBe(dataFromServer[1].id)
})

test("Correct tickers should be delete", () => {

    let ticker = "AAPL"
    const endState = financeDataReducer(startState,
        deleteTicker(ticker)
    )

    expect(endState.isFetchData).toBeFalsy()
    expect(endState.data[0].ticker).toBe("GOOGL")
    expect(endState.data.length).toBe(1)
})
test("Correct set fetching() for show progress", () => {

    let isFetching = true
    const endState = financeDataReducer(startState,
        setIsFetching(isFetching)
    )

    expect(endState.isFetchData).toBeTruthy()
})
