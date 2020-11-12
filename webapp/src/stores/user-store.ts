import {observable} from "mobx";
import {auth, generateUserDocument} from "../firebase/firebase.utils";
import {createContext} from "react";
import {User} from "../domain/user";

class UserStore {
    @observable user: User | null = null;

    constructor() {
        auth.onAuthStateChanged(async userAuth => {
            // add empty history to user
            const additionalData = {
                'history': ['']
            };

            this.user = await generateUserDocument(userAuth, additionalData) as User;
        });
    }
}

export const userStore = new UserStore();

export default createContext(userStore);