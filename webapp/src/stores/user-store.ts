import {makeAutoObservable} from "mobx";
import {auth, firestore} from "../firebase";
import {generateUserDocument} from "../firebase/firebase.utils";
import {User} from "../domain/user";

export class UserStore {
    user: User | null = null;
    initialized = false;

    constructor() {
        makeAutoObservable(this);

        auth.onAuthStateChanged(async userAuth => {
            // add empty history to user
            const additionalData = {};

            this.user = await generateUserDocument(userAuth, additionalData) as User;
            // We put uid into local storage so that we don't need to wait for firebase to initialize before sending
            // requests to the server. This is especially important if we want to use interceptors to add Authorization
            // header and handle signing in.
            if (userAuth) {
                localStorage.setItem("auth_token", await userAuth.getIdToken());
            }

            this.initialized = true;
        });
    }

    async rename(name: string): Promise<void> {
        if (this.user == null) return;

        const userRef = firestore.doc(`Users/${this.user.uid}`);
        await userRef.update({displayName: name});
        this.user.displayName = name;
    }
}

export const userStore = new UserStore();