import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {Group} from "../domain/group";
import axios from 'axios';
import {serverPrefix} from "../common/config";
import {Message, unwrap} from "../domain/message";

class GroupStore {
    activeGroups: Group[] = [];
    historyGroups: Group[] = [];
    groupDetails = new Map<string, GroupProfileStore>();

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

    room(id: string): GroupProfileStore {
        const store = this.groupDetails.get(id)
        if (store) {
            return store;
        }

        const newStore = new GroupProfileStore(id);
        this.groupDetails.set(id, newStore);
        return newStore;
    }
}

class GroupProfileStore {
    data: Group | null = null;

    constructor(public groupId: string) {
        makeAutoObservable(this);
    }

    async update() {
        this.data = unwrap((await axios.get<Message<Group>>(`${serverPrefix}/room/${this.groupId}`)).data);
    }

    async setGroupName(name: string) {
        await axios.put(`${serverPrefix}/room/${this.groupId}`, {
            roomName: name
        });

        this.update();
    }

    async join() {
        await axios.put(`${serverPrefix}/room/${this.groupId}/member`);
        this.update();
    }

    async endMatch() {
        await axios.put(`${serverPrefix}/room/${this.groupId}`, {
            isCompleted: true
        });

        this.update();
    }
}

export const groupStore = new GroupStore();

export default createContext(groupStore);
