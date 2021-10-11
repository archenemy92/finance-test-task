import React from "react"
import {ChangeEvent} from "react"
import {useEffect} from "react"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {useSelector} from "react-redux"
import {AppStateType} from "../../bll/store"
import {TickersDataType} from "../../api/api"
import {FinanceCard} from "./FinanceCard/FinanceCard"
import {Box} from "@material-ui/core"
import {IconButton} from "@material-ui/core"
import {TextField} from "@material-ui/core"
import {addTicker} from "../../bll/financeDataReducer"
import {changeInterval} from "../../bll/financeDataReducer"
import {deleteTick} from "../../bll/financeDataReducer"
import {setIsFetching} from "../../bll/financeDataReducer"
import CheckIcon from "@mui/icons-material/Check"
import AddIcon from "@mui/icons-material/Add"
import {Container} from "@mui/material"
import {LinearProgress} from "@mui/material"
import {Paper} from "@mui/material"
import style from "./Main.module.css"

export const Main: React.FC = () => {
    let tickers = useSelector<AppStateType, TickersDataType[]>(state => state.finance.data)
    let isFetching = useSelector<AppStateType, boolean>(state => state.finance.isFetchData)
    let [inputValue, setInputValue] = useState<string>("")
    let [valueInterval, setValueInterval] = useState<string>("1")
    let [error, setError] = useState<string>("")
    let [disabled, setDisabled] = useState<boolean>(false)

    const dispatch = useDispatch()

    let filterTickerHandler = (ticker: string) => {
        dispatch(deleteTick(ticker))
    }
    let onChangeValueIntervalHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValueInterval(e.currentTarget.value)
    }
    let onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
        setError("")
    }
    let addTickerHandler = () => {
        let isSameTicker = tickers.some(t => t.ticker === inputValue.toUpperCase())
        if (isSameTicker) {
            setError("The ticker has already been created")
        }
        dispatch(addTicker(inputValue.toUpperCase()))

    }
    let onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (error) {
                return
            }
            addTickerHandler()
        }
    }
    let changeIntervalHandler = () => {
        dispatch(changeInterval(valueInterval))
    }

    useEffect(() => {
        let tick = localStorage.getItem("data")
        if (!tick) {
            tick = JSON.stringify(tickers)
        }
        let arr
        if (tick) {
            arr = JSON.parse(tick)
        }

        if (arr.length !== tickers.length) {
            setDisabled(true)
            dispatch(setIsFetching(true))
        } else {
            setDisabled(false)
            dispatch(setIsFetching(false))
        }

    }, [tickers, dispatch])

    useEffect(() => {
        if (inputValue.length > 5) {
            setError("max 5 symbols")
        }
    }, [inputValue])

    return (
        <div className={style.main}>
            {isFetching && <Box sx={{width: "100%"}}>
                <LinearProgress color={"secondary"}/>
            </Box>}
            <div className={style.inputsFields__main}>
                <div>
                    <TextField
                        inputProps={{max: "6", min: "1"}}
                        error={valueInterval === "6"}
                        label={valueInterval === "6" ? "max value" : "timeout"}
                        type={"number"}
                        size={"small"}
                        value={valueInterval}
                        onChange={onChangeValueIntervalHandler}/>
                    <IconButton color={"primary"} onClick={changeIntervalHandler}>
                        <CheckIcon/>
                    </IconButton>
                </div>
                <div style={{margin: "10px 0 0 0"}}>
                    <TextField
                        error={!!error}
                        value={inputValue}
                        size={"small"}
                        label={error ? error : "add new ticker"}
                        onChange={onChangeHandler}
                        onKeyPress={onKeyPressHandler}/>
                    <IconButton
                        color={"success"} onClick={addTickerHandler} disabled={!!error}>
                        <AddIcon/>
                    </IconButton>
                </div>
            </div>

            <Container className={style.cards_container__main}>
                {tickers.map((card) => <Paper
                    elevation={5}
                    key={card.id} className={style.cards_paper__main}>
                    <FinanceCard {...card} filter={filterTickerHandler} disabled={disabled}/>
                </Paper>)
                }
            </Container>
        </div>
    )
}
