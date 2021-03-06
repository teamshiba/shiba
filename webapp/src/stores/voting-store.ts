import { makeAutoObservable } from "mobx";
import { VotingItem, VotingItemResponse } from "../domain/voting-item";
import axios from "axios";
import { serverPrefix } from "../common/config";
import { userStore } from "./user-store";
import { getOrCreate } from "../common/utils";

export class VotingStore {
  private votings = new Map<string, RoomVotingStore>();

  constructor() {
    makeAutoObservable(this);
  }

  room(id: string): RoomVotingStore {
    return getOrCreate(this.votings, id, (id) => new RoomVotingStore(id));
  }
}

class RoomVotingStore {
  items = new Map<string, VotingItem>();
  totalCount = 0;
  unvotedCount = 0;

  constructor(public roomId: string) {
    makeAutoObservable(this);
  }

  async updateItems() {
    const endpoint = `${serverPrefix}/item/list?gid=${this.roomId}&unvoted_by=${userStore.user?.userId}`;
    const response = (await axios.get<VotingItemResponse>(endpoint)).data;
    this.mergeItems(response);
  }

  async vote(itemId: string, option: "like" | "dislike") {
    const response = (
      await axios.put<VotingItemResponse>(`${serverPrefix}/voting`, {
        itemId,
        groupId: this.roomId,
        type: option == "like" ? 1 : -1,
      })
    ).data;

    this.mergeItems(response);
    this.items.delete(itemId);
  }

  private mergeItems(response: VotingItemResponse): void {
    this.totalCount = response.roomTotal;
    this.unvotedCount = response.items.length;

    for (const item of response.items) {
      this.items.set(item.itemId, item);
    }
  }
}

export const votingStore = new VotingStore();
