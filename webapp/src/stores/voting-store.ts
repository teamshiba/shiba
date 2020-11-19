import {makeAutoObservable} from "mobx";
import {VotingItem, VotingItemResponse} from "../domain/voting-item";
import axios from "axios";
import {serverPrefix} from "../common/config";
import {userStore} from "./user-store";

export class VotingStore {
    private votings = new Map<string, RoomVotingStore>();

    constructor() {
        makeAutoObservable(this);
    }

    room(id: string): RoomVotingStore {
        const store = this.votings.get(id)
        if (store) {
            return store;
        }

        const newStore = new RoomVotingStore(id);
        this.votings.set(id, newStore);
        return newStore;
    }
}

class RoomVotingStore {
    items = new Map<string, VotingItem>();
    totalCount = 0;
    unvotedCount = 0;
    voted = false;

    constructor(public roomId: string) {
        makeAutoObservable(this);
    }

    async updateItems() {
        const endpoint = `${serverPrefix}/item/list?gid=${this.roomId}&voted_by=${userStore.user?.uid}`
        const response = (await axios.get<VotingItemResponse>(endpoint)).data;
        this.mergeItems(response);
    }

    async vote(itemId: string, option: "like" | "dislike") {
        this.voted = true;

        const response = (await axios.put<VotingItemResponse>(`${serverPrefix}/voting`, {
            itemId,
            groupId: this.roomId,
            type: option == "like" ? 1 : -1,
        })).data;

        this.mergeItems(response);
        this.items.delete(itemId);
    }

    private mergeItems(response: VotingItemResponse) {
        this.totalCount = response.roomTotal;
        this.unvotedCount = response.items.length;

        for (const item of response.items) {
            this.items.set(item.id, item);
        }
    }
}

export const votingStore = new VotingStore();

