import {makeAutoObservable} from "mobx";
import {auth, generateUserDocument} from "../firebase/firebase.utils";
import {createContext} from "react";
import {User} from "../domain/user";

class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);

        auth.onAuthStateChanged(async userAuth => {
            // add empty history to user
            const additionalData = {};

            this.user = await generateUserDocument(userAuth, additionalData) as User;
            // We put uid into local storage so that we don't need to wait for firebase to initialize before sending
            // requests to the server. This is especially important if we want to use interceptors to add Authorization
            // header and handle signing in.
            localStorage.setItem("uid", this.user.uid);
        });
    }

    get currentUid(): string | null {
        return localStorage.getItem("uid");
    }
}

export const userStore = new UserStore();

export default createContext(userStore);