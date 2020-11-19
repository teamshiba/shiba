import React, { FC } from "react";
import "./App.css";
import ShibaLogo from "./components/ShibaLogo";
import { Button, createStyles } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { browserHistory } from "./common/utils";

const styles = makeStyles(() =>
  createStyles({
    root: {
      color: "white",
      backgroundColor: "#FFBC6F",
      "&:hover": {
        backgroundColor: "#ffb35a",
      },
      width: "250px",
      height: "60px",
      borderRadius: "15px",
      fontSize: "24px",
      fontWeight: "bold",
    },
  })
);

const App: FC = () => {
  const classes = styles();

  return (
    <div className="App">
      <header className="App-header">
        <h1 className={"title"}>Shiba Match</h1>

        <div style={{ height: "200px" }}>
          <ShibaLogo />
        </div>

        <h1 className={"catch"}>Find your soul</h1>

        <p className={"desc"}>
          Easily find a restaurant or hotel for your group.
        </p>

        <Button
          className={classes.root}
          variant="contained"
          disableElevation
          onClick={() => browserHistory.push("/auth/")}
        >
          Log In
        </Button>
      </header>
    </div>
  );
};

export default App;
