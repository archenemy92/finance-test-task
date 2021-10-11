"use strict"
const express = require("express")
const http = require("http")
const io = require("socket.io")
const cors = require("cors")
const {v1} = require("uuid")

let FETCH_INTERVAL = 5000
const PORT = process.env.PORT || 4000

let changeSpeed = FETCH_INTERVAL;

let tickers = [
  "AAPL", // Apple
  "GOOGL", // Alphabet
  "MSFT", // Microsoft
  "AMZN", // Amazon
  "FB", // Facebook
  "TSLA", // Tesla
]

let changeInterval = (interval) => {
  changeSpeed = +interval + "000"
}


let isSameValue
let addTicker = (ticker) => {
  isSameValue = tickers.some(el => el === ticker)
  if (isSameValue) {
    return
  }
  tickers = [ticker, ...tickers]
}

let delTicker = (ticker) => {
  tickers = tickers.filter(t => t !== ticker)
}



function randomValue(min = 0, max = 1, precision = 0) {
  const random = Math.random() * (max - min) + min
  return random.toFixed(precision)
}

function utcDate() {
  const now = new Date()
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
}

function getQuotes(socket) {
  const quotes = tickers.map(ticker => ({
    ticker,
    exchange: "NASDAQ",
    price: randomValue(100, 300, 2),
    change: randomValue(0, 200, 2),
    change_percent: randomValue(0, 1, 2),
    dividend: randomValue(0, 1, 2),
    yield: randomValue(0, 2, 2),
    last_trade_time: utcDate(),
    id: v1()
  }))
  socket.emit("ticker", quotes)
}

function trackTickers(socket) {
  // run the first time immediately
  getQuotes(socket)

  let run = setInterval(()=>{
    request()
    getQuotes(socket)
  } , FETCH_INTERVAL); // start setInterval as "run"

  function request() {

    clearInterval(run); // stop the setInterval()

    // dynamically change the run interval
    if(changeSpeed !== FETCH_INTERVAL ){
      FETCH_INTERVAL = changeSpeed
    }

    run = setInterval(()=>{
      request()
      getQuotes(socket)
    }, FETCH_INTERVAL); // start the setInterval()

  }

  socket.on("disconnect", function () {
    clearInterval(run)
  })
}

const app = express()
app.use(cors())
const server = http.createServer(app)

const socketServer = io(server, {
  cors: {
    origin: "*"
  }
})

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
})
const ioConnection = socketServer.listen(server)
ioConnection.on("connection", (socket) => {
  socket.on("start", () => {
    trackTickers(socket)
  })
  socket.on("deletedTicker", (ticker) => {
    delTicker(ticker)
  })
  socket.on("addedTicker", (ticker) => {
    addTicker(ticker)
  })
  socket.on("setInterval", (seconds) => {
    changeInterval(seconds)
  })
})

server.listen(PORT, () => {
  console.log(`Streaming service is running on http://localhost:${PORT}`)
})
