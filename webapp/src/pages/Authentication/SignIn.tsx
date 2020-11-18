/**
 * @desc authentication page.
 */

import React, {FC} from "react";
import {Container} from "@material-ui/core";
import firebase from "../../firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

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

const SignIn: FC = () => {
    return (
        <Container>
            <h1 style={{color: "#FFBC6F", fontSize: "30px", fontWeight: 800, marginTop: 0}}>Sign In</h1>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </Container>
    );
};

export default SignIn;
