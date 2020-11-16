import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {VotingItem} from "../domain/voting-item";

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
    items = new Set<VotingItem>();
    totalCount = 0;
    voted = false;

    constructor(public roomId: string) {
        makeAutoObservable(this);
    }

    async updateItems() {
        const response = {
            roomTotal: 2,
            items: [
                {
                    id: "a",
                    name: 'Ginza Kyubey',
                    imgURL: 'https://jw-webmagazine.com/wp-content/uploads/2019/06/jw-5d146db6e10238.04380328.jpeg',
                    location: 'Ginza, Tokyo'
                },
                {
                    id: "b",
                    name: 'The MOON',
                    imgURL: 'http://thesun-themoon.com/moon/images/about/g-01.jpg',
                    location: 'Shibuya, Tokyo'
                },
            ]
        };

        this.totalCount = response.roomTotal;

        for (const item of response.items) {
            this.items.add(item);
        }
    }

    async vote(itemId: string, option: "like" | "dislike") {
        this.voted = true;

        console.log(itemId, option);
        let targetItem = null;
        for (const item of this.items.values()) {
            if (item.id == itemId) {
                targetItem = item;
            }
        }

        if (targetItem) {
            this.items.delete(targetItem);
        }
    }
}

export const votingStore = new VotingStore();

export default createContext(votingStore);
