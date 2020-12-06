import { makeAutoObservable } from "mobx";
import axios from "axios";
import { serverPrefix } from "../../common/config";
import { getOrCreate } from "../../common/utils";
import { VotingItem } from "../../domain/voting-item";

export class ItemStore {
  private items = new Map<string, RoomItemStore>();

  constructor() {
    makeAutoObservable(this);
  }

  room(id: string): RoomItemStore {
    return getOrCreate(this.items, id, (id) => new RoomItemStore(id));
  }
}

export class RoomItemStore {
  itemsRecommended = new Map<string, VotingItem>();
  itemsSearched = new Map<string, VotingItem>();
  term = "";

  constructor(public roomId: string) {
    makeAutoObservable(this);
  }

  get items(): VotingItem[] {
    const map =
      this.term.length > 0 ? this.itemsSearched : this.itemsRecommended;
    return Array.from(map.values());
  }

  async search(term: string): Promise<void> {
    this.term = term;
    // Depending on whether the term is empty, store the response into recommended or searched items
    const dest = term == "" ? this.itemsRecommended : this.itemsSearched;
    dest.clear();

    const response: VotingItem[] =
      term == ""
        ? [
            {
              itemId: "id1",
              imgURL: "http://example.com/item1.jpg",
              itemURL: "http://example.com/item1",
              name: "Recommended Item 1",
              rating: 10.0,
              categories: [{ alias: "", title: "" }],
            },
          ]
        : [
            {
              itemId: "id2",
              imgURL: "http://example.com/item2.jpg",
              itemURL: "http://example.com/item2",
              name: `Searched Item: ${term}`,
              rating: 10.0,
              categories: [{ alias: "", title: "" }],
            },
          ];

    response.map((item) => dest.set(item.itemId, item));
  }

  async addItem(item: VotingItem): Promise<void> {
    await axios.post(`${serverPrefix}/item`, {
      item,
      groupId: this.roomId,
    });
  }
}

export const itemStore = new ItemStore();
