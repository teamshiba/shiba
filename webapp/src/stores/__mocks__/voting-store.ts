import {makeAutoObservable} from "mobx";
import {VotingItem} from "../../domain/voting-item";
import {getOrCreate} from "../../common/utils";

class VotingStore {
    private votings = new Map<string, RoomVotingStore>();

    constructor() {
        makeAutoObservable(this);
    }

    room(id: string): RoomVotingStore {
        return getOrCreate(this.votings, id,
            (id) => new RoomVotingStore(id));
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
            itemId: "item1",
            name: "Item 1",
        } as VotingItem];

        for (const item of items) {
            this.items.set(item.itemId, item);
        }
    }

    async vote(itemId: string) {
        this.items.delete(itemId);
    }

    async addItem(item: VotingItem): Promise<void> {
        this.items.set(item.itemId, item);
    }

}

export const votingStore = new VotingStore();
