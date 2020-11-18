/**
 * @desc Homepage. List of matching rooms.
 */

import React, {FC, Fragment, useContext, useEffect, useState} from "react";
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
import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import {Group} from "../../domain/group";
import {browserHistory} from "../../common/utils";
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles(() => ({
    listItem: {
        height: "4em",
    },
}));

interface IModalProps {
    isOpen: boolean;
    handleClose: () => void;
}

const CreateGroupModal: FC<IModalProps> = ((props) => {
    const groupStore = useContext(GroupStore);
    const [groupName, setGroupName] = useState("");

    return (
        <Dialog open={props.isOpen} onClose={props.handleClose}
                aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth={true}>
            <DialogTitle id="form-dialog-title">Create Group</DialogTitle>

            <form onSubmit={(e) => {
                e.preventDefault();
                groupStore.createGroup(groupName);
                setGroupName("");
                props.handleClose();
            }}>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="groupName"
                        label="Group Name"
                        type="text"
                        placeholder={groupName}
                        fullWidth
                        onChange={e => {
                            setGroupName(e.target.value)
                        }}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={props.handleClose} color="primary" type="submit">
                        Create!
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
})

interface IRoomListProps {
    groups: Group[]
}

const roomAvatarName = (name: string): string => {
    const letters = name.split(" ")
        .filter(w => w.length > 0)
        .map(w => w.charAt(0));

    return letters.slice(0, 3).join("");
}

const RoomList: FC<IRoomListProps> = (props) => {
    const classes = useStyles();

    return <List>
        {props.groups.map(group =>
            <ListItem className={classes.listItem} key={group.groupId} button
                      onClick={() => browserHistory.push(`/room/${group.groupId}`)}>
                <ListItemIcon>
                    <Avatar>{roomAvatarName(group.roomName)}</Avatar>
                </ListItemIcon>
                <ListItemText primary={group.roomName}/>
            </ListItem>
        )}
    </List>
}

export const ActiveRoomList: FC = observer(() => {
    const groupStore = useContext(GroupStore);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        groupStore.updateActiveGroups();
    }, []);

    return <Fragment>
        <Header buttons={<IconButton onClick={() => setOpen(true)}> <AddIcon/> </IconButton>}>
            <ShibaLogo/>
        </Header>
        <RoomList groups={groupStore.activeGroups}/>
        <CreateGroupModal isOpen={isOpen} handleClose={() => setOpen(false)}/>
    </Fragment>
})

export const HistoryRoomList: FC = observer(() => {
    const groupStore = useContext(GroupStore);

    useEffect(() => {
        groupStore.updateHistoryGroups();
    }, []);

    return <Fragment>
        <Header> <ShibaLogo/> </Header>
        <RoomList groups={groupStore.historyGroups}/>
    </Fragment>
})
