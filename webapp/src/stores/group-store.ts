import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {Group, GroupDetail} from "../domain/group";
import axios from 'axios';
import {serverPrefix} from "../common/config";
import {Message, unwrap} from "../domain/message";

class GroupStore {
    activeGroups: Group[] = [];
    historyGroups: Group[] = [];
    groupDetails = new Map<string, GroupDetailStore>();

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

    room(id: string): GroupDetailStore {
        const store = this.groupDetails.get(id)
        if (store) {
            return store;
        }

        const newStore = new GroupDetailStore(id);
        this.groupDetails.set(id, newStore);
        return newStore;
    }
}

class GroupDetailStore {
    data: GroupDetail | null = null;

    constructor(public groupId: string) {
        makeAutoObservable(this);
    }

    async update() {
        this.data = unwrap((await axios.get<Message<GroupDetail>>(`${serverPrefix}/room?gid=${this.groupId}`)).data);
    }
}

export const groupStore = new GroupStore();

export default createContext(groupStore);
