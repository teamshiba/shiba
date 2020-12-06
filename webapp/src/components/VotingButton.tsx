import IconButton from "@material-ui/core/IconButton";
import React, { ComponentType, FC } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface IProps {
  onClick?: () => void;
  icon: ComponentType<{ className: string }>;
  className?: string | null;
  disabled?: boolean;
}

const useStyles = makeStyles(() => ({
  bgContainer: {
    "&& bgContainer": {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#F0F0F0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  bg: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "white",
    "&& :hover": {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: "white",
    },
    // https://github.com/mui-org/material-ui/issues/13779
    "&$bgDisabled": {
      backgroundColor: "white",
    },
  },
  bgDisabled: {},
  button: {
    fontSize: "30px",
    borderRadius: "50%",
  },
}));

const ButtonAdd: FC<IProps> = (props) => {
  const classes = useStyles();
  const classNames = [classes.button];
  if (props.className) {
    classNames.push(props.className);
  }

  const Icon = props.icon;

  return (
    <div className={classes.bgContainer}>
      <IconButton
        disabled={props.disabled}
        onClick={props.onClick}
        classes={{
          root: classes.bg,
          disabled: classes.bgDisabled,
        }}
      >
        <Icon className={classNames.join(" ")} />
      </IconButton>
    </div>
  );
};

export default ButtonAdd;
