/**
 * @desc authentication page.
 */

import React, {FC, useEffect} from "react";
import Box from '@material-ui/core/Box';
import ShibaLogo from "../../components/ShibaLogo";
import Header from "../../components/Header";
import {browserHistory} from "../../common/utils";
import {Container} from "@material-ui/core";
import {StyledFirebaseAuth} from "react-firebaseui";
import firebase from "../../firebase";

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: "/room/active",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
}

const Authentication: FC = () => {
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token && token.length > 0) {
            browserHistory.push("/room/active");
        }
    }, []);

    return (
        <>
            <Header>
                <ShibaLogo/>
            </Header>
            <div>
                <Box display="flex" alignItems="center">
                    <Container>
                        <h1 style={{color: "#FFBC6F", fontSize: "30px", fontWeight: 800, marginTop: 0}}>Sign In</h1>
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                    </Container>
                </Box>
            </div>
        </>

    );
};

export default Authentication;
