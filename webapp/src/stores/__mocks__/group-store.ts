import {makeAutoObservable} from "mobx";
import {Group} from "../../domain/group";
import {User} from "../../domain/user";
import {getOrCreate} from "../../common/utils";

class GroupStore {
    activeGroups: Group[] = [];
    historyGroups: Group[] = [];
    groupDetails = new Map<string, GroupProfileStore>();

    constructor() {
        makeAutoObservable(this);
    }

    async updateActiveGroups() {
        this.activeGroups = [{
            groupId: "groupId1",
            roomName: "Test Group 1",
            isCompleted: false,
            members: [],
        }, {
            groupId: "groupId2",
            roomName: "Test Group 2",
            isCompleted: false,
            members: [],
        }];
    }

    async updateHistoryGroups() {
        this.historyGroups = [{
            groupId: "groupId3",
            roomName: "Test Group 3",
            isCompleted: true,
            members: [],
        }, {
            groupId: "groupId4",
            roomName: "Test Group 4",
            isCompleted: true,
            members: [],
        }];
    }

    async createGroup(name: string) {
        this.activeGroups.push({
            groupId: "groupId5",
            roomName: name,
            isCompleted: false,
            members: [],
        });
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
        this.data = {
            groupId: this.groupId,
            roomName: `Test Group ${this.groupId}`,
            isCompleted: false,
            members: [{
                userId: "1234",
                displayName: `User in ${this.groupId}`,
            } as User],
        };
    }

    async setGroupName(name: string) {
        if (!this.data) return;
        this.data.roomName = name;
    }

    async join() {
        if (!this.data) return;
    }

    async endMatch() {
        if (!this.data) return;
        this.data.isCompleted = true;
    }
}

export const groupStore = new GroupStore();
