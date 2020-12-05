import { makeAutoObservable } from "mobx";
import axios from "axios";
import { serverPrefix } from "../common/config";
import { getOrCreate } from "../common/utils";
import {
  SearchResponse,
  SearchResponseItem,
  VotingItem,
} from "../domain/voting-item";

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

  async search(
    term: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    this.term = term;
    // Depending on whether the term is empty, store the response into recommended or searched items
    const dest = term == "" ? this.itemsRecommended : this.itemsSearched;
    dest.clear();
    let endpoint;

    const termParameter = term.length > 0 ? `&term=${this.term}` : "";
    if (latitude === -1 && longitude === -1) {
      const location = "NYC";
      endpoint = `${serverPrefix}/item/search?location=${location}${termParameter}`;
    } else {
      endpoint = `${serverPrefix}/item/search?latitude=${latitude}&longitude=${longitude}${termParameter}`;
    }

    const response = await axios.get<SearchResponse>(endpoint);
    if (response.status === 400) {
      return;
    }

    response.data.businesses.map(
      (item) =>
        RoomItemStore.isValidItem(item) &&
        dest.set(item.id, { itemId: item.id, ...item })
    );
  }

  async addItem(item: VotingItem): Promise<void> {
    await axios.post(`${serverPrefix}/item`, {
      item,
      groupId: this.roomId,
    });
  }

  private static isValidItem(item: SearchResponseItem): boolean {
    for (const category of item.categories) {
      const alias = category.alias;
      if (alias.includes("park") || alias.includes("museum")) {
        return false;
      }
    }
    return true;
  }
}

export const itemStore = new ItemStore();
