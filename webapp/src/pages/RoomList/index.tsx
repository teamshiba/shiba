/**
 * @desc Homepage. List of matching rooms.
 */

import React, {FC, useContext, useEffect} from "react";
import Header from "../../components/Header";
import ShibaLogo from "../../components/ShibaLogo";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import GroupStore from "../../stores/group-store";
import {observer} from "mobx-react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {ListItemIcon} from "@material-ui/core";
import InboxIcon from '@material-ui/icons/Inbox';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    listItem: {
        height: "4em",
    },
}));

const RoomList: FC = observer(() => {
    const groupStore = useContext(GroupStore);
    const classes = useStyles();

    useEffect(() => {
        groupStore.updateActiveGroups();
    }, []);

    return <div>
        <Header buttons={<IconButton> <AddIcon/> </IconButton>}>
            <ShibaLogo/>
        </Header>
        <List>
            {groupStore.activeGroups.map(group => <ListItem className={classes.listItem} key={group.id.toString()}
                                                            button>
                <ListItemIcon>
                    <InboxIcon/>
                </ListItemIcon>
                <ListItemText primary={group.name}/>
            </ListItem>)}
        </List>
    </div>
})

export default RoomList;