import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AppStateType} from "../../bll/store"
import {TickersDataType} from "../../api/api"
import {Chart} from "react-google-charts"
import {NavLink} from "react-router-dom"
import {IconButton} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import style from "./CardContainer.module.css"
import {setTickerTitle} from "../../bll/financeDataReducer"

export const CardContainer: React.FC = () => {
    const tickers = useSelector<AppStateType, TickersDataType[]>(state => state.finance.data)
    let newArr = tickers.map(t => [t.last_trade_time.slice(11, -5), +t.price.current])
    let tickerTitle = useSelector<AppStateType, string>(state => state.finance.ticker)

    const tickerObj = tickers.find(t => t.ticker === tickerTitle)
    const [prices, setPrices] = useState<(string | number)[][]>([])

    const dispatch = useDispatch()

    useEffect(() => {
        if (prices.length > 100) {
            setPrices(state => state.splice(50))
        }
    }, [prices])

    useEffect(() => {
        setPrices([...newArr, ...prices])
    }, [tickers])
    return (
        <div>
            {
                tickerTitle ? <div className={style.main__card}>
                        <div>

                            <h3 className={style.title_main__card}>{tickerObj?.ticker}</h3>
                            <div className={style.desc_main__card}>
                                <div>price: {tickerObj?.price.current}</div>
                                <div>dividend: {tickerObj?.dividend}</div>
                                <div>yield: {tickerObj?.yield}</div>
                                <div>change-percent: {tickerObj?.change_percent}</div>
                                <div>change: {tickerObj?.change}</div>
                                <div>exchange: {tickerObj?.exchange}</div>
                                <div>time: {tickerObj?.last_trade_time}</div>
                            </div>

                        </div>
                        <div>
                            <Chart
                                height={"400px"}
                                chartType="LineChart"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ["h", "temp"],
                                    ...prices
                                ]}
                                options={{
                                    hAxis: {
                                        title: "Time",
                                    },
                                    vAxis: {
                                        title: "Price",
                                    },
                                    width: 500
                                }}
                                rootProps={{"data-testid": "1"}}
                            />

                            <NavLink
                                className={style.go_back_button__main___card} to={"/"}>
                                <IconButton size={"small"} color={"error"}
                                            onClick={() => dispatch(setTickerTitle(""))}>
                                    <ArrowBackIcon/>
                                </IconButton>
                                BACK
                            </NavLink>
                        </div>
                    </div> :
                    <div>
                        <h1>
                            <NavLink
                                style={{textDecoration: "none", color: "red"}}
                                to={"/"}>
                                please, choose ticker
                            </NavLink>
                        </h1>
                    </div>
            }
        </div>
    )
}