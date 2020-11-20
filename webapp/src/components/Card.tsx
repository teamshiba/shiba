import React, { FC } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface IProps {
  title?: string;
}

const useStyles = makeStyles(() => ({
  title: {
    fontSize: "1.25em",
    fontFamily: "sans-serif",
  },
  container: {
    margin: "0.5em",
  },
}));

const Card: FC<IProps> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {props.title && <div className={classes.title}>{props.title}</div>}
      {props.children}
    </div>
  );
};

export default Card;
