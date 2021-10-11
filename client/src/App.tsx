import React from "react"
import {useEffect} from "react"
import {Header} from "./components/Header/Header"
import {Main} from "./components/Main/Main"
import {useDispatch} from "react-redux"
import {useSelector} from "react-redux"
import {deleteChannel} from "./bll/financeDataReducer"
import {getFinanceData} from "./bll/financeDataReducer"
import {AppStateType} from "./bll/store"
import {initialized} from "./bll/appReducer"
import {Box} from "@mui/material"
import {CircularProgress} from "@material-ui/core"
import style from "./App.module.css"
import {NavLink, Redirect, Route, Switch} from "react-router-dom"
import {CardContainer} from "./components/Card/CardContainer"

export const App: React.FC = () => {
    const isInitializeSuccess = useSelector<AppStateType, boolean>(state => state.app.isInitialize)
    const dispatch = useDispatch()


    useEffect(() => {
        setTimeout(() => {
            dispatch(initialized(true))
        }, 3000)
    }, [dispatch])

    useEffect(() => {
        dispatch(getFinanceData())
        return () => {
            dispatch(deleteChannel())
        }
    }, [dispatch])

    return (

        <div className={style.app}>
            <Header/>

            {!isInitializeSuccess
                ?
                <div className={style.initialized_progress__app}>
                    <Box sx={{display: "flex"}}>
                        <CircularProgress/>
                    </Box>
                </div>
                :
                <div>
                    <Switch>
                        <Route exact path={"/"} render={()=> <Main/>}/>
                        <Route path={"/card"} render={()=> <CardContainer/>}/>
                        <Route path={"/404"} render={() => <div>
                            <NavLink to={"/"}>
                                go to maine page
                            </NavLink>
                            <h1>404: page not found</h1>
                        </div>}/>
                        <Redirect from={"*"} to={"/404"}/>
                    </Switch>
                </div>
            }
        </div>
    )
}

