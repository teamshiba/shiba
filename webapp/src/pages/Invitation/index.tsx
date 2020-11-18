/**
 * @desc user can read or modify the information of a matching room here.
 */

import React, {FC, Fragment, useContext, useEffect} from "react";
import {RouteComponentProps} from "react-router";
import GroupStore from "../../stores/group-store";
import Header from "../../components/Header";
import {observer} from "mobx-react";
import Card from "../../components/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AvatarList from "../../components/AvatarList";
import {Button} from "@material-ui/core";
import {browserHistory} from "../../common/utils";

type IProps = RouteComponentProps<{ id: string }>

const useStyles = makeStyles(() => ({
    buttons: {
        display: "flex",
        justifyContent: "center",
        margin: "1em",

        "& *": {
            padding: "1em",
        }
    },
    rejectButton: {
        color: "#ff0000",
    },
    okButton: {
        color: "#00ff00",
    },
}))

const Invitation: FC<IProps> = observer((props) => {
    const classes = useStyles();
    const roomId = props.match.params["id"];
    const groupProfileStore = useContext(GroupStore).room(roomId);

    useEffect(() => {
        groupProfileStore.update();
    }, []);

    if (!groupProfileStore.data) return null;

    const handleOk = () => {
        groupProfileStore.join();
        browserHistory.push(`/room/${roomId}`);
    };

    const handleReject = () => {
        browserHistory.push("/room/active");
    }

    return <Fragment>
        <Header hasBackButton>{groupProfileStore.data.roomName}</Header>
        <Card title="Current Members">
            <AvatarList members={groupProfileStore.data.members}/>
        </Card>
        <Card title="Join this group?">
            <div className={classes.buttons}>
                <Button className={classes.rejectButton} onClick={handleReject}>
                    No
                </Button>
                <Button className={classes.okButton} onClick={handleOk}>
                    Sure!
                </Button>
            </div>
        </Card>
    </Fragment>
})

export default Invitation;
