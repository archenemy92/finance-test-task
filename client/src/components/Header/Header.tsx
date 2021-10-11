import React from "react"
import {AppBar} from "@material-ui/core"
import {Box} from "@material-ui/core"
import {Toolbar} from "@material-ui/core"
import {Typography} from "@material-ui/core"

export const Header: React.FC = () => {

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" style={{backgroundColor: "hsl(94, 77%, 74%)", color: "black"}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Stock exchange
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}