import {makeAutoObservable} from "mobx";
import {VotingItem} from "../../domain/voting-item";

class VotingStore {
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
    updated = false;
    voted = false;

    constructor(public roomId: string) {
        makeAutoObservable(this);
    }

    async updateItems() {
        if (this.updated) return;
        this.updated = true;

        const items = [{
            id: "item1",
            name: "Item 1",
        } as VotingItem];

        for (const item of items) {
            this.items.set(item.id, item);
        }
    }

    async vote(itemId: string) {
        this.items.delete(itemId);
    }

}

export const votingStore = new VotingStore();
