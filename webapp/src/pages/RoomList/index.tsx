/**
 * @desc Homepage. List of matching rooms.
 */

import React, {FC, useContext, useEffect, useState} from "react";
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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


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
                groupStore.addActiveGroup(
                    groupStore.activeGroups[groupStore.activeGroups.length - 1].id + 1,
                    groupName
                )
                setGroupName("");
                props.handleClose(); } }>

                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="groupName"
                    label="Group Name"
                    type="text"
                    placeholder={groupName}
                    fullWidth
                    onChange ={e => {
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

const RoomList: FC = observer(() => {
    const groupStore = useContext(GroupStore);
    const classes = useStyles();
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        groupStore.updateActiveGroups();
    }, []);

    return <div>
        <Header buttons={<IconButton onClick={() => setOpen(true)}> <AddIcon/> </IconButton>}>
            <ShibaLogo/>
        </Header>
        <List>
            {groupStore.activeGroups.map(group =>
                <ListItem className={classes.listItem} key={group.id.toString()} button>
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={group.name}/>
                </ListItem>
            )}
        </List>
        <CreateGroupModal isOpen={isOpen} handleClose={() => setOpen(false)}/>
    </div>
})

export default RoomList;