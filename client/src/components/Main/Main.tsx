import React from "react"
import {ChangeEvent} from "react"
import {KeyboardEvent} from "react"
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
import {addTicker, setIntervalUpdate} from "../../bll/financeDataReducer"
import {changeInterval} from "../../bll/financeDataReducer"
import {deleteTick} from "../../bll/financeDataReducer"
import {setIsFetching} from "../../bll/financeDataReducer"
import CheckIcon from "@mui/icons-material/Check"
import AddIcon from "@mui/icons-material/Add"
import {Container} from "@mui/material"
import {LinearProgress} from "@mui/material"
import {Paper} from "@mui/material"
import style from "./Main.module.css"

export type DisabledType = "delete" | "timeout" | "unDisabled"

export const Main: React.FC = () => {
    let tickers = useSelector<AppStateType, TickersDataType[]>(state => state.finance.data)
    let isFetching = useSelector<AppStateType, boolean>(state => state.finance.isFetchData)
    let interval = useSelector<AppStateType, string>(state => state.finance.interval)
    let [inputValue, setInputValue] = useState<string>("")
    let [valueInterval, setValueInterval] = useState<string>("1")
    let [error, setError] = useState<string>("")
    let [errorTimeout, setErrorTimeout] = useState<string>("")
    let [disabled, setDisabled] = useState<DisabledType>("unDisabled")
    const dispatch = useDispatch()

    let disable = isFetching || !!errorTimeout ||interval === valueInterval

    let filterTickerHandler = (ticker: string) => {
        dispatch(deleteTick(ticker))
    }
    let onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) =>{
        ["e", "E", "+", "-", ".",  ","].includes(e.key) && e.preventDefault()
    }

    let onChangeValueIntervalHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length > 1){
            setErrorTimeout("no more than one symbol")
        }
        else {
            setErrorTimeout("")
        }
        setValueInterval(e.currentTarget.value)
    }
    let setIntervalHandler = () => {
        setValueInterval(valueInterval)
        dispatch(setIntervalUpdate(valueInterval))
        dispatch(changeInterval(valueInterval))
    }
    let onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
        setError("")
    }
    let addTickerHandler = () => {
        let isSameTicker = tickers.some(t => t.ticker === inputValue.toUpperCase())
        if (isSameTicker) {
            setError("The ticker has already been created")
            return
        }
        if (inputValue.trim() === "") {
            setError("please, input ticker")
            return
        }
        dispatch(addTicker(inputValue.toUpperCase(), valueInterval))
        setInputValue("")

    }
    let onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (error) {
                return
            }
            addTickerHandler()
        }
    }

    useEffect(() => {
        let ticker = localStorage.getItem("data")
        if (!ticker) {
            ticker = JSON.stringify(tickers)
        }
        let neArrTicker
        if (ticker) {
            neArrTicker = JSON.parse(ticker)
        }

        if (neArrTicker.length !== tickers.length) {
            setDisabled("delete")
            dispatch(setIsFetching(true))
        } else {
            setDisabled("unDisabled")
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
                        inputProps={{max: "5", min: "1"}}
                        label={valueInterval === "5" ? "max value" : "timeout"}
                        error={!!errorTimeout}
                        helperText={errorTimeout}
                        type={"number"}
                        size={"small"}
                        value={valueInterval}
                        onChange={onChangeValueIntervalHandler}
                        onKeyDown={onKeyDownHandler}/>
                    <IconButton color={"primary"} onClick={setIntervalHandler} disabled={disable}>
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
                        color={"success"} onClick={addTickerHandler} disabled={!!error || isFetching}>
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
