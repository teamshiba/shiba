/**
 * @desc the header layout for all pages.
 */

import React, {FC, ReactNode} from "react";
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {browserHistory} from "../common/utils";

interface IProps {
    hasBackButton?: boolean;
    children: ReactNode;
    buttons?: ReactNode | ReactNode[];
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    backButton: {
        marginRight: theme.spacing(2),
        zIndex: 1,
    },
    title: {
        position: "absolute",
        left: 0,
        right: 0,
        height: "2em",
        width: "100%",
        textAlign: "center",
        lineHeight: "2em",
        fontFamily: "sans-serif",
        fontSize: "1.25em",
        color: theme.palette.primary.main,
    },
    buttons: {
        position: "absolute",
        right: theme.spacing(2),
    }
}));

const Header: FC<IProps> = (props) => {
    const classes = useStyles();
    return (<AppBar position="static" color="secondary">
        <Toolbar>
            {props.hasBackButton && (
                <IconButton edge="start" className={classes.backButton}
                            onClick={() => browserHistory.goBack()}>
                    <ArrowBackIosIcon/>
                </IconButton>)}
            <div className={classes.title}>
                {props.children}
            </div>
            <div className={classes.buttons}>
                {props.buttons}
            </div>
        </Toolbar>
    </AppBar>)
};

export default Header;
