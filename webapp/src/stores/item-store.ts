import { makeAutoObservable } from "mobx";
import { VotingItem } from "../domain/voting-item";
import axios from "axios";
import { serverPrefix } from "../common/config";
import { getOrCreate } from "../common/utils";

const fakeRecItems: VotingItem[] = [
  {
    itemId: "rec-north-india-restaurant-san-francisco",
    imgURL:
      "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
    name: "Rec North India Restaurant",
    itemURL: "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
  },
];

const fakeItems: VotingItem[] = [
  {
    itemId: "2north-india-restaurant-san-francisco",
    imgURL:
      "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
    name: "2North India Restaurant",
    itemURL: "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
  },
  {
    itemId: "2molinari-delicatessen-san-francisco",
    imgURL:
      "http://s3-media4.fl.yelpcdn.com/bphoto/6He-NlZrAv2mDV-yg6jW3g/o.jpg",
    name: "2Molinari Delicatessen",
    itemURL: "yelp.com/biz/molinari-delicatessen-san-francisco",
  },
];

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

  async updateRecommendedItems(
    latitude: number,
    longitude: number
  ): Promise<void> {
    // const endpoint = `${serverPrefix}/item/list?gid=${this.roomId}&unvoted_by=${userStore.user?.userId}`;
    // const response = (await axios.get<VotingItemResponse>(endpoint)).data;
    // this.mergeItems(response);

    if (latitude === -1 && longitude === -1) {
      // Some other way to get recommendation
    }

    fakeRecItems.map((item) => this.itemsRecommended.set(item.itemId, item));
  }

  async search(term: string): Promise<void> {
    this.term = term;
    fakeItems.map((item) => this.itemsSearched.set(item.itemId, item));
  }

  async addItem(item: VotingItem): Promise<void> {
    await axios.post(`${serverPrefix}/item`, {
      groupId: this.roomId,
      item,
    });
  }
}

export const itemStore = new ItemStore();
