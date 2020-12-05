/**
 * @desc user can read or modify the information of a matching room here.
 */

import React, { FC, Fragment, MouseEvent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import Header from "../../components/Header";
import { observer } from "mobx-react";
import Card from "../../components/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Button, ListItem, Popover } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import EditInput from "../../components/EditInput";
import { copyToClipboard } from "../../common/utils";
import AvatarList from "../../components/AvatarList";
import { groupStore } from "../../stores/group-store";
import { userStore } from "../../stores/user-store";
import { User } from "../../domain/user";
import List from "@material-ui/core/List";
import { ConfirmProvider, useConfirm } from "material-ui-confirm";

type IProps = RouteComponentProps<{ id: string }>;

const useStyles = makeStyles(() => ({
  endButton: {
    width: "100%",
    color: "#ff0000",
  },
  textField: {
    width: "100%",
  },
}));

type AnchorElType = Element | ((element: Element) => Element);

interface EditPopOverProps {
  user: User;
  anchorEl?: AnchorElType;
  onClose?: () => void;
  onMakeOrganizer?: () => void;
  onRemoveUser?: () => void;
}

const MemberEditPopOver: FC<EditPopOverProps> = (props) => {
  const open = Boolean(props.anchorEl);

  const confirm = useConfirm();

  const wrapAction = (action: () => void): (() => void) => {
    return () => {
      action();
      props.onClose && props.onClose();
    };
  };

  const handleMakeOrganizer = wrapAction(() => {
    const handler = props.onMakeOrganizer;
    if (!handler) return;

    confirm({
      description:
        "Are you sure you want to make " +
        props.user.displayName +
        " the organizer of the group?",
    })
      .then(() => {
        handler();
      })
      .catch(() => null); // ignore error to do nothing on cancel
  });

  const handleRemoveUser = wrapAction(() => {
    const handler = props.onRemoveUser;
    if (!handler) return;

    confirm({
      description:
        "Are you sure you want to remove " +
        props.user.displayName +
        " from the group?",
    })
      .then(() => {
        handler();
      })
      .catch(() => null); // ignore error to do nothing on cancel
  });

  return (
    <Popover
      open={open}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <List>
        <ListItem button onClick={handleMakeOrganizer}>
          Transfer Organizer
        </ListItem>
        <ListItem button onClick={handleRemoveUser}>
          Remove
        </ListItem>
      </List>
    </Popover>
  );
};

interface GroupAvatarListProps {
  organizerUID: string;
  currentUID: string;
  members: User[];
  onRemoveUser: (user: User) => void;
  onMakeOrganizer: (user: User) => void;
}

const GroupAvatarList: FC<GroupAvatarListProps> = (props) => {
  const [popOverState, setPopOverState] = useState<{
    user: User;
    anchorEl: AnchorElType;
  } | null>(null);
  const handleOpenUserPopOver = (
    event: MouseEvent<HTMLDivElement>,
    user: User
  ) => {
    // Don't show the popover for non-organizer or current user
    if (
      !(props.organizerUID === props.currentUID) ||
      user.userId == props.currentUID
    ) {
      return;
    }

    setPopOverState({
      user,
      anchorEl: event.target as HTMLDivElement,
    });
  };

  const handleCloseUserPopOver = () => {
    setPopOverState(null);
  };

  return (
    <ConfirmProvider>
      <AvatarList
        highlightUid={props.organizerUID}
        members={props.members}
        onClick={handleOpenUserPopOver}
      />
      {popOverState && (
        <MemberEditPopOver
          user={popOverState.user}
          anchorEl={popOverState.anchorEl}
          onClose={handleCloseUserPopOver}
          onMakeOrganizer={() => props.onMakeOrganizer(popOverState.user)}
          onRemoveUser={() => props.onRemoveUser(popOverState.user)}
        />
      )}
    </ConfirmProvider>
  );
};

const RoomProfile: FC<IProps> = observer((props) => {
  const classes = useStyles();
  const roomId = props.match.params["id"];
  const groupProfileStore = groupStore.room(roomId);

  useEffect(() => {
    groupProfileStore.update();
  }, []);

  if (!groupProfileStore.data || !userStore.user) return null;

  const invitationLink = new URL(
    `/join/${roomId}`,
    location.toString()
  ).toString();

  return (
    <Fragment>
      <Header hasBackButton>{groupProfileStore.data.roomName}</Header>
      <Card title="Members">
        <GroupAvatarList
          organizerUID={groupProfileStore.data.organizerUid}
          currentUID={userStore.user.userId}
          members={groupProfileStore.data.members}
          onMakeOrganizer={(user) =>
            groupProfileStore.makeOrganizer(user.userId)
          }
          onRemoveUser={(user) => groupProfileStore.removeUser(user.userId)}
        />
      </Card>
      <Card title="Group Name">
        <EditInput
          className={classes.textField}
          value={groupProfileStore.data.roomName}
          onSubmit={(name) => groupProfileStore.setGroupName(name)}
        />
      </Card>
      <Card title="Invitation Link">
        <Input
          className={classes.textField}
          value={invitationLink}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => copyToClipboard(invitationLink)}>
                <FileCopyIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Card>
      {!groupProfileStore.data.isCompleted &&
        groupProfileStore.data.organizerUid === userStore.user?.userId && (
          <Card>
            <Button
              className={classes.endButton}
              onClick={() => groupProfileStore.endMatch()}
            >
              End this match
            </Button>
          </Card>
        )}
    </Fragment>
  );
});

export default RoomProfile;
