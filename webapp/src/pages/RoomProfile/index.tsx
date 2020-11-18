/**
 * @desc user can read or modify the information of a matching room here.
 */

import React, {FC, Fragment, useContext, useEffect} from "react";
import {RouteComponentProps} from "react-router";
import GroupStore from "../../stores/group-store";
import Header from "../../components/Header";
import {observer} from "mobx-react";
import Avatar from "@material-ui/core/Avatar";
import Card from "../../components/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Button} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditInput from "../../components/EditInput";
import {copyToClipboard} from "../../common/utils";

type IProps = RouteComponentProps<{ id: string }>

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
    endButton: {
        width: "100%",
        color: "#ff0000",
    },
    textField: {
        width: "100%",
    }
}))

const RoomProfile: FC<IProps> = observer((props) => {
    const classes = useStyles();
    const roomId = props.match.params["id"];
    const groupProfileStore = useContext(GroupStore).room(roomId);

    useEffect(() => {
        groupProfileStore.update();
    }, []);

    if (!groupProfileStore.data) return null;

    const invitationLink = new URL(`/join/${roomId}`, location.toString()).toString();

    return <Fragment>
        <Header hasBackButton>{groupProfileStore.data.roomName}</Header>
        <Card title="Members">
            <div className={classes.avatarList}>
                {groupProfileStore.data.members.map(member =>
                    <div className={classes.avatar}>
                        <Avatar src={member.photoURL}/>
                        <span>{member.displayName}</span>
                    </div>
                )}
            </div>
        </Card>
        <Card title="Group Name">
            <EditInput className={classes.textField}
                       value={groupProfileStore.data.roomName}
                       onSubmit={(name) => groupProfileStore.setGroupName(name)}/>
        </Card>
        <Card title="Invitation Link">
            <Input className={classes.textField} value={invitationLink}
                   endAdornment={
                       <InputAdornment position="end">
                           <IconButton onClick={() => copyToClipboard(invitationLink)}>
                               <FileCopyIcon/>
                           </IconButton>
                       </InputAdornment>
                   }/>
        </Card>
        {!groupProfileStore.data.isCompleted &&
        <Card>
            <Button className={classes.endButton}
                    onClick={() => groupProfileStore.endMatch()}>
                End this match
            </Button>
        </Card>}
    </Fragment>
})

export default RoomProfile;