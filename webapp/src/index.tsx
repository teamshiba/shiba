import React from "react";
import ReactDOM from "react-dom";
import { Route, Router, Switch } from "react-router";
import "./index.css";
import Layout from "./components/Layout";
import App from "./App";
import Authentication from "./pages/Authentication/index";
import { browserHistory } from "./common/utils";
import { ActiveRoomList, HistoryRoomList } from "./pages/RoomList";
import Voting from "./pages/Voting";
import Statistics from "./pages/Statistics";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";
import UserProfile from "./pages/UserProfile";
import axios from "axios";
import AuthSynchronizer from "./components/AuthSynchronizer";
import RoomProfile from "./pages/RoomProfile";
import Invitation from "./pages/Invitation";
import AddItems from "./pages/AddItems";

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("auth_token");
    if (accessToken == null) {
      return config;
    }

    config.headers = {
      ...config.headers,
      Authorization: "Bearer " + accessToken,
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response && 401 === error.response.status) {
      localStorage.removeItem("auth_token");
      browserHistory.push("/auth/");
    }

    return Promise.reject(error);
  }
);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFBC6F",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
  shadows: Array(25).fill("none") as Shadows,
});

ReactDOM.render(
  <React.StrictMode>
    <AuthSynchronizer>
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Switch>
            <Route path="/" component={App} exact={true} />
            <Route path="/404" component={App} />
            <Route path="/auth/" component={Authentication} />
            <Layout>
              <Route path="/room">
                <Switch>
                  <Route path="/room/active" component={ActiveRoomList} />
                  <Route path="/room/history" component={HistoryRoomList} />
                  <Route path="/room/:id/profile" component={RoomProfile} />
                  <Route path="/room/:id/stats" component={Statistics} />
                  <Route path="/room/:id/add" component={AddItems} />
                  <Route path="/room/:id" component={Voting} />
                </Switch>
              </Route>
              <Route path="/user/">
                <Route path="/user/profile" component={UserProfile} />
              </Route>
              <Route path="/join/:id" component={Invitation} />
            </Layout>
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthSynchronizer>
  </React.StrictMode>,
  document.getElementById("root")
);
