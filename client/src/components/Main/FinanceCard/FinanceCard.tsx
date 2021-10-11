import React from "react"
import {IconButton} from "@mui/material"
import {TickersDataType} from "../../../api/api"
import up from "./../../../accets/Green_Triangle.png"
import down from "./../../../accets/Red_Triangle.svg.png"
import DeleteIcon from "@mui/icons-material/Delete"
import style from "./FinanceCard.module.css"
import {NavLink} from "react-router-dom"
import {useDispatch} from "react-redux"
import {setTickerTitle} from "../../../bll/financeDataReducer"

type FinanceCardPropsType = TickersDataType & {
    filter: (ticker: string) => void
    disabled: boolean
}

export const FinanceCard: React.FC<FinanceCardPropsType> = (props) => {

    const dispatch = useDispatch()

    let currentPrice = props.price.prev < props.price.current

    let setPicture = currentPrice ? up : down

    const filterTicker = () => {
        props.filter(props.ticker)
    }

    const setColor = () => {
        if (currentPrice) {
            return {
                color: "green"
            }
        } else {
            return {
                color: "red"
            }
        }
    }

    const setTickerTitleHandler = () => {
        dispatch(setTickerTitle(props.ticker))
    }

    return (
        <div className={style.card}>
            <NavLink to={"/card"}
                     className={style.info_block__card}
                     onClick={setTickerTitleHandler}>
                <div className={style.title_info_block__card}>
                    <img src={setPicture} alt="triangle"/>
                    <span>{props.ticker}</span>
                </div>

                <div className={style.desc_info_block__card}>
                    <div style={setColor()}>
                        <span>price: </span>
                        <span>{props.price.current}</span>
                    </div>
                    <div>
                        <span>perct:</span>
                        <span> {props.change_percent}%</span>
                    </div>
                </div>
            </NavLink>

            <div className={style.buttonBlock__card}>
                <IconButton
                    style={{height: "30px", margin: "10px 0 0 0"}}
                    size={"small"}
                    color={"warning"}
                    onClick={filterTicker}
                    disabled={props.disabled}>
                    <DeleteIcon/>
                </IconButton>
            </div>
        </div>
    )
}



