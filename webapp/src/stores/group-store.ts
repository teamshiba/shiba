import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {Group} from "../domain/group";
import axios from 'axios';
import {serverPrefix} from "../common/config";
import {Message, unwrap} from "../domain/message";

class GroupStore {
    activeGroups: Group[] = [];
    historyGroups: Group[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async updateActiveGroups() {
        const uid = localStorage.getItem("uid");
        this.activeGroups = unwrap((await axios.get<Message<Group[]>>(`${serverPrefix}/room/list?uid=${uid}`)).data);
    }

    async updateHistoryGroups() {
        const uid = localStorage.getItem("uid");
        this.historyGroups = unwrap((await axios.get<Message<Group[]>>(`${serverPrefix}/room/list?uid=${uid}&state=true`)).data);
    }

    async createGroup(name: string) {
        await axios.post(`${serverPrefix}/room`, {
            "userId": localStorage.getItem("uid"),
            "displayName": name,
        });

        await this.updateActiveGroups();
    }
}

export const groupStore = new GroupStore();

export default createContext(groupStore);
