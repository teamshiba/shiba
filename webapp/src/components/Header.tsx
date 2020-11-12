/**
 * @desc the header layout for all pages.
 */

import React, {FC, ReactNode} from "react";
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {createPortal} from "react-dom";
import {usePortal} from "../common/hooks";

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
    },
    title: {
        position: "absolute",
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
        textAlign: "center",
        lineHeight: "4em",
    },
    buttons: {
        position: "absolute",
        right: theme.spacing(2),
    }
}));

const Header: FC<IProps> = (props) => {
    const classes = useStyles();
    return createPortal((
            <AppBar position="static" color="secondary">
                <Toolbar>
                    {props.hasBackButton && (
                        <IconButton edge="start" className={classes.backButton}>
                            <ArrowBackIosIcon/>
                        </IconButton>)}
                    <div className={classes.title}>
                        {props.children}
                    </div>
                    <div className={classes.buttons}>
                        {props.buttons}
                    </div>
                </Toolbar>
            </AppBar>),
        usePortal("header")
    );
};

export default Header;
