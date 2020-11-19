import {makeAutoObservable} from "mobx";
import {Group} from "../domain/group";
import axios from 'axios';
import {serverPrefix} from "../common/config";
import {Message, unwrap} from "../domain/message";
import {getOrCreate} from "../common/utils";

export class GroupStore {
    activeGroups: Group[] = [];
    historyGroups: Group[] = [];
    groupDetails = new Map<string, GroupProfileStore>();

    constructor() {
        makeAutoObservable(this);
    }

    async updateActiveGroups(): Promise<void> {
        this.activeGroups = unwrap((await axios.get<Message<Group[]>>(`${serverPrefix}/room/list`)).data);
    }

    async updateHistoryGroups(): Promise<void> {
        this.historyGroups = unwrap((await axios.get<Message<Group[]>>(`${serverPrefix}/room/list?state=true`)).data);
    }

    async createGroup(name: string): Promise<void> {
        await axios.post(`${serverPrefix}/room`, {
            "roomName": name,
        });

        await this.updateActiveGroups();
    }

    room(id: string): GroupProfileStore {
        return getOrCreate(this.groupDetails, id,
            (id) => new GroupProfileStore(id));
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
