/**
 * @desc user can read or modify the information of a matching room here.
 */

import React, { FC, MouseEvent } from "react";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { User } from "../domain/user";
import Badge from "@material-ui/core/Badge";
import StarIcon from "@material-ui/icons/Star";

interface IProps {
  members: User[];
  highlightUid?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>, user: User) => void;
}

const useStyles = makeStyles(() => ({
  avatarList: {
    display: "flex",
  },
  avatar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& *": {
      margin: "0.5em",
    },
    "& span": {
      fontSize: "0.75em",
      fontFamily: "sans-serif",
    },
  },
}));

const AvatarList: FC<IProps> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.avatarList}>
      {props.members.map((member) => (
        <div className={classes.avatar} key={member.userId}>
          <Badge
            badgeContent={
              member.userId === props.highlightUid ? (
                <StarIcon color="primary" />
              ) : undefined
            }
          >
            <Avatar
              onClick={(event) => props.onClick && props.onClick(event, member)}
              src={member.photoURL}
            />
          </Badge>
          <span>{member.displayName}</span>
        </div>
      ))}
    </div>
  );
};

export default AvatarList;
