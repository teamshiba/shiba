/**
 * @desc user can read or modify the information of a matching room here.
 */

import React, {FC} from "react";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {User} from "../domain/user";

interface IProps {
    members: User[]
}

const useStyles = makeStyles(() => ({
    avatarList: {
        display: "flex",
    },
    avatar: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0.5em",
        "& *": {
            margin: "0.5em",
        },
        "& span": {
            fontSize: "0.75em",
            fontFamily: "sans-serif",
        }
    },
}))

const AvatarList: FC<IProps> = (props) => {
    const classes = useStyles();

    return <div className={classes.avatarList}>
        {props.members.map(member =>
            <div className={classes.avatar} key={member.uid}>
                <Avatar src={member.photoURL}/>
                <span>{member.displayName}</span>
            </div>
        )}
    </div>
}

export default AvatarList;
