/**
 * @desc Handle User created in firestore.
 */

import React, {Component, createContext} from "react";
import {auth, generateUserDocument} from "../firebase/firebase.utils";


export const UserContext = createContext({user: null});

class UserProvider extends Component {
    state = {
        user: null
    };

    // eslint-disable-next-line
    componentDidMount = async () => {
        auth.onAuthStateChanged(async userAuth => {
            // add empty history to user
            const adtionalData = {
                'history': ['']
            };
            const user = await generateUserDocument(userAuth, adtionalData);
            this.setState({user});
        });


    };

    // eslint-disable-next-line
    render() {
        const {user} = this.state;

        return (
            <UserContext.Provider value={user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserProvider;