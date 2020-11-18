import React from 'react';
import logo from './logo.svg';
import './App.css';
import ShibaLogo from "./components/ShibaLogo";
import Authentication from "./pages/Authentication";
import {Route} from "react-router";
import {Button} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const ColorButton = withStyles((theme) => ({
  root: {
    color: 'white',
    backgroundColor: '#FFBC6F',
    '&:hover': {
      backgroundColor: '#ffb35a',
    },
    width: '250px',
    height: '60px',
    borderRadius: '15px',
    fontSize: '24px',
    fontWeight: "bold",
  },
}))(Button);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ height: '200px' }}>
          <ShibaLogo />
        </div>

        <h1>Find your soul</h1>

        <p>
          Easily find a restaurant or hotel for your group.
        </p>

        <ColorButton variant="contained" color="primary" disableElevation>
          Log In
        </ColorButton>


      </header>
    </div>
  );
}

export default App;
