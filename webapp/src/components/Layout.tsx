/**
 * @desc Public layout for many pages.
 */

import React, { FC } from "react";
import Footer from "./Footer";
import { Container } from "@material-ui/core";
import { browserHistory } from "../common/utils";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface IProps {
  children: React.ReactNode;
}

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flexGrow: 1,
  },
}));

const Layout: FC<IProps> = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="xs">
      <div className={classes.content}>{props.children}</div>
      <Footer history={browserHistory} />
    </Container>
  );
};

export default Layout;
