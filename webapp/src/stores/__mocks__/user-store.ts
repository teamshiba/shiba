import {makeAutoObservable} from "mobx";
import {User} from "../../domain/user";

class UserStore {
    user: User | null = null;
    initialized = false;

    constructor() {
        makeAutoObservable(this);
    }
}

export const userStore = new UserStore();
