/**
 * @desc user profile. users can edit their own profile. they can also log out here.
 */

import React, {FC, Fragment, useContext} from "react";
import {observer} from "mobx-react";
import UserStore from "../../stores/user-store";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ShibaLogo from "../../components/ShibaLogo";
import Header from "../../components/Header";
import makeStyles from "@material-ui/core/styles/makeStyles";
import firebase from "../../firebase";
import {browserHistory} from "../../common/utils";

const useStyles = makeStyles(() => ({
    avatar: {
        justifyContent: "center",
        "& *": {
            margin: "1em"
        }
    }
}))

const UserProfile: FC = observer(() => {
    const classes = useStyles();
    const userStore = useContext(UserStore);
    if (userStore.user == null) return null;

    const handleSignout = () => {
        firebase.auth().signOut();
        browserHistory.push("/auth/");
    }

    return <Fragment>
        <Header><ShibaLogo/></Header>
        <List>
            <ListItem className={classes.avatar} divider>
                <Avatar src={userStore.user.photoURL}/>
                {userStore.user.displayName}
            </ListItem>
            <ListItem button>
                <ListItemText primary="Edit Name"/>
            </ListItem>
            <ListItem button onClick={handleSignout}>
                <ListItemText primary="Sign out"/>
            </ListItem>
        </List>
    </Fragment>
});

export default UserProfile;