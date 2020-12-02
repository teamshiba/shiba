import IconButton from "@material-ui/core/IconButton";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface IProps {
  handleAdd: () => void;
}

const useStyles = makeStyles(() => ({
  votingButtonBg: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "white",
  },
  votingButton: {
    fontSize: "30px",
    borderRadius: "50%",
  },
  addButton: {
    color: "#2F80ED",
  },
}));

const ButtonAdd: FC<IProps> = (props) => {
  const classes = useStyles();
  return (
    <div>
      <IconButton
        className={classes.votingButtonBg}
        onClick={() => props.handleAdd()}
      >
        <AddOutlinedIcon
          className={`${classes.addButton} ${classes.votingButton}`}
        />
      </IconButton>
    </div>
  );
};

export default ButtonAdd;
