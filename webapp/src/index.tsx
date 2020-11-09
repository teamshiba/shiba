import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, Switch} from 'react-router'
import {createBrowserHistory} from 'history';
import './index.css';
import Layout from "./components/Layout";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { browserHistory } from './common/utils';

ReactDOM.render(
    <React.StrictMode>
        <Router history={browserHistory}>
            <Switch>
                <Route path="/" component={App} exact={true}/>
                <Route path="/404" component={App}/>
                <Route path={"/auth/"}>
                    <Route path={'login'}/>
                    <Route path={'signup'}/>
                </Route>
                <Layout>
                    <Route path={"/room/"}>
                        <Route path={'active'}/>
                        <Route path={'history'}/>
                    </Route>
                    <Route path={"/room/:id"}>
                    </Route>
                    <Route path={"/user/"}>
                        <Route path={'profile'}/>
                    </Route>
                </Layout>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
