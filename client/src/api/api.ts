import {io} from "socket.io-client"

let subscribers = [] as SubscriberType[]

const socket = io("http://localhost:4000")

const createChannel = () => {
    socket.connect()
    socket.emit("start")
    socket.on("ticker", (response) => {
        localStorage.setItem("data", JSON.stringify(response))
        subscribers.forEach(s => s(response))
    })
}

const deleteTicker = (tickerTitle: string) => {
    socket.emit("deletedTicker", tickerTitle)
}
const addTicker = (tickerTitle: string) => {
    socket.emit("addedTicker", tickerTitle)
}
const changeInterval = (sec: string) => {
    socket.emit("setInterval", sec)
}

const deleteChannel = () => {
    socket.close()
}

export const getDataApi = {
    subscribeNewData(callback: SubscriberType) {
        subscribers.push(callback)
    },
    delTicker(ticker: string) {
        deleteTicker(ticker)
    },
    addTicker(ticker: string) {
        addTicker(ticker)
    },
    changeInterval(seconds: string) {
        changeInterval(seconds)
    },
    start() {
        createChannel()
    },
    stop() {
        deleteChannel()
    }
}
export type SubscriberType = (data: TickersDataType[]) => void
export type TickersDataType = {
    ticker: string
    exchange: string
    price: any
    change: string
    change_percent: string
    dividend: string
    yield: string
    last_trade_time: string
    id: string
}

