/**
 * @desc user profile. users can edit their own profile. they can also log out here.
 */

import React, {FC, Fragment, useContext} from "react";
import {observer} from "mobx-react";
import UserStore from "../../stores/user-store";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import firebase from "../../firebase";
import {browserHistory} from "../../common/utils";
import Card from "../../components/Card";
import EditInput from "../../components/EditInput";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
    avatar: {
        margin: "2em auto 2em auto",
        height: "5em",
        width: "5em",
    },
    textField: {
        width: "100%",
    },
    signOutButton: {
        marginTop: "2em",
        width: "100%",
        color: "#ff0000",
    }
}))

const UserProfile: FC = observer(() => {
    const classes = useStyles();
    const userStore = useContext(UserStore);
    if (userStore.user == null) return null;

    const handleRename = (newName: string) => {
        userStore.rename(newName);
    }

    const handleSignout = () => {
        firebase.auth().signOut();
        browserHistory.push("/auth/");
    }

    return <Fragment>
        <Card>
            <Avatar className={classes.avatar} src={userStore.user.photoURL}/>
        </Card>
        <Card title="Name">
            <EditInput className={classes.textField}
                       value={userStore.user.displayName}
                       onSubmit={handleRename}/>
        </Card>
        <Card>
            <Button className={classes.signOutButton}
                    onClick={handleSignout}>
                Sign Out
            </Button>
        </Card>
    </Fragment>
});

export default UserProfile;