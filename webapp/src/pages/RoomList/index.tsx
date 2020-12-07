/**
 * @desc Homepage. List of matching rooms.
 */

import React, { FC, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import AddIcon from "@material-ui/icons/Add";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Group } from "../../domain/group";
import { groupStore } from "../../stores/group-store";
import List from "@material-ui/core/List";
import Message from "../../components/Message";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { browserHistory } from "../../common/utils";
import Avatar from "@material-ui/core/Avatar";
import ShibaLogo from "../../components/ShibaLogo";
import Header from "../../components/Header";
import { observer } from "mobx-react";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(() => ({
  listItem: {
    height: "4em",
  },
}));

interface IModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const CreateGroupModal: FC<IModalProps> = (props) => {
  const [groupName, setGroupName] = useState("");

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">Create Group</DialogTitle>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          groupStore.createGroup(groupName);
          setGroupName("");
          props.handleClose();
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="groupName"
            label="Group Name"
            type="text"
            value={groupName}
            fullWidth
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={props.handleClose}
            color="primary"
            type="submit"
            disabled={groupName.length == 0}
          >
            Create!
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

interface IRoomListProps {
  groups: Group[];
  emptyMessage: string;
}

const roomAvatarName = (name: string): string => {
  const letters = name
    .split(" ")
    .filter((w) => w.length > 0)
    .map((w) => w.charAt(0));

  return letters.slice(0, 3).join("");
};

const RoomList: FC<IRoomListProps> = (props) => {
  const classes = useStyles();
  if (props.groups.length == 0) {
    return <Message>{props.emptyMessage}</Message>;
  }

  return (
    <List>
      {props.groups.map((group) => (
        <ListItem
          className={classes.listItem}
          key={group.groupId}
          button
          onClick={() => browserHistory.push(`/room/${group.groupId}`)}
        >
          <ListItemIcon>
            <Avatar>{roomAvatarName(group.roomName)}</Avatar>
          </ListItemIcon>
          <ListItemText primary={group.roomName} />
        </ListItem>
      ))}
    </List>
  );
};

export const ActiveRoomList: FC = observer(() => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    groupStore.updateActiveGroups();
  }, []);

  return (
    <>
      <Header
        buttons={
          <IconButton onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        }
      >
        <ShibaLogo />
      </Header>
      <RoomList
        groups={groupStore.activeGroups}
        emptyMessage="No rooms joined yet, click add button to create one or join some existing rooms"
      />
      <CreateGroupModal isOpen={isOpen} handleClose={() => setOpen(false)} />
    </>
  );
});

export const HistoryRoomList: FC = observer(() => {
  useEffect(() => {
    groupStore.updateHistoryGroups();
  }, []);

  return (
    <>
      <Header>
        <ShibaLogo />
      </Header>
      <RoomList
        groups={groupStore.historyGroups}
        emptyMessage="No history rooms yet, after a room is completed, it will be shown here"
      />
    </>
  );
});

export const __testExports = { CreateGroupModal };
