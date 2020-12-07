import makeStyles from "@material-ui/core/styles/makeStyles";
import { FC } from "react";

const useStyles = makeStyles(() => ({
  message: {
    margin: "3em",
    textAlign: "center",
    fontSize: "1.5em",
    fontFamily: "sans-serif",
    color: "#cccccc",
  },
}));

const Message: FC = (props) => {
  const classes = useStyles();
  return <div className={classes.message}>{props.children}</div>;
};

export default Message;
