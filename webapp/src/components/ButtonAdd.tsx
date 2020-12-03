import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import VotingButton from "./VotingButton";

interface IProps {
  handleAdd: () => void;
}

const useStyles = makeStyles(() => ({
  addButton: {
    color: "#2F80ED",
  },
}));

const ButtonAdd: FC<IProps> = (props) => {
  const classes = useStyles();

  return (
    <VotingButton
      onClick={props.handleAdd}
      icon={AddOutlinedIcon}
      className={classes.addButton}
    />
  );
};

export default ButtonAdd;
