import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, Switch} from 'react-router'
import './index.css';
import Layout from "./components/Layout";
import App from './App';
import Authentication from "./pages/Authentication/index"
import reportWebVitals from './reportWebVitals';
import {browserHistory} from './common/utils';
import RoomList from "./pages/RoomList";
import Voting from "./pages/Voting";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {Shadows} from "@material-ui/core/styles/shadows";
import UserProfile from "./pages/UserProfile";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#FFBC6F",
        },
        secondary: {
            main: "#FFFFFF"
        },
    },
    shadows: Array(25).fill("none") as Shadows
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Router history={browserHistory}>
                <Switch>
                    <Route path="/" component={App} exact={true}/>
                    <Route path="/404" component={App}/>
                    <Route path="/auth/" component={Authentication}/>
                    <Layout>
                        <Route path="/room">
                            <Switch>
                                <Route path="/room/active" component={RoomList}/>
                                <Route path="/room/history"/>
                                <Route path="/room/:id" component={Voting}/>
                            </Switch>
                        </Route>
                        <Route path="/user/">
                            <Route path="/user/profile" component={UserProfile}/>
                        </Route>
                    </Layout>
                </Switch>
            </Router>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
