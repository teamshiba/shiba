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
        this.activeGroups = unwrap((await axios.get<Message<Group[]>>(`${serverPrefix}/room/list`)).data);
    }

    async updateHistoryGroups() {
        this.historyGroups = unwrap((await axios.get<Message<Group[]>>(`${serverPrefix}/room/list?state=true`)).data);
    }

    async createGroup(name: string) {
        await axios.post(`${serverPrefix}/room`, {
            "displayName": name,
        });

        await this.updateActiveGroups();
    }
}

export const groupStore = new GroupStore();

export default createContext(groupStore);
