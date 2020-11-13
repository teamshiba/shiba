import {makeAutoObservable, observable} from "mobx";
import {createContext} from "react";
import {Group} from "../domain/group";

class GroupStore {
    @observable activeGroups: Group[] = [];
    @observable historyGroups: Group[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    async updateActiveGroups() {
        this.activeGroups = [
            {
                id: 1,
                name: "Test Group 1",
            },
            {
                id: 2,
                name: "Test Group 2",
            }
        ];
    }
}

export const groupStore = new GroupStore();

export default createContext(groupStore);
