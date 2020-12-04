import { makeAutoObservable } from "mobx";
import axios from "axios";
import { serverPrefix } from "../common/config";
import { getOrCreate } from "../common/utils";
import { Item, ItemResponse } from "../domain/item";

// const fakeRecItems: Item[] = [
//   {
//     id: "rec-north-india-restaurant-san-francisco",
//     imgURL:
//       "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
//     name: "Rec North India Restaurant",
//     itemURL: "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
//     rating: 4.0,
//   },
// ];
//
// const fakeItems: Item[] = [
//   {
//     itemId: "2north-india-restaurant-san-francisco",
//     imgURL:
//       "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
//     name: "2North India Restaurant",
//     itemURL: "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
//   },
//   {
//     itemId: "2molinari-delicatessen-san-francisco",
//     imgURL:
//       "http://s3-media4.fl.yelpcdn.com/bphoto/6He-NlZrAv2mDV-yg6jW3g/o.jpg",
//     name: "2Molinari Delicatessen",
//     itemURL: "yelp.com/biz/molinari-delicatessen-san-francisco",
//   },
// ];

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
  itemsRecommended = new Map<string, Item>();
  itemsSearched = new Map<string, Item>();
  term = "";

  constructor(public roomId: string) {
    makeAutoObservable(this);
  }

  get items(): Item[] {
    const map =
      this.term.length > 0 ? this.itemsSearched : this.itemsRecommended;
    return Array.from(map.values());
  }

  async updateRecommendedItems(
    latitude: number,
    longitude: number
  ): Promise<void> {
    this.itemsRecommended.clear();
    let endpoint;

    if (latitude === -1 && longitude === -1) {
      const location = "NYC";
      endpoint = `${serverPrefix}/item/search?location=${location}`;
    } else {
      endpoint = `${serverPrefix}/item/search?latitude=${latitude}&longitude=${longitude}`;
    }

    const response = await axios.get<ItemResponse>(endpoint);
    if (response.status === 400) {
      return;
    }

    response.data.businesses
      .sort((a, b) => b.rating - a.rating)
      .map(
        (item) =>
          this.isValidItem(item) && this.itemsRecommended.set(item.id, item)
      );
  }

  async search(
    term: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    this.itemsSearched.clear();
    this.term = term;
    let endpoint;

    if (latitude === -1 && longitude === -1) {
      const location = "NYC";
      endpoint = `${serverPrefix}/item/search?location=NYC&term=${this.term}`;
    } else {
      endpoint = `${serverPrefix}/item/search?latitude=${latitude}&longitude=${longitude}&term=${this.term}`;
    }

    const response = await axios.get<ItemResponse>(endpoint);
    if (response.status === 400) {
      return;
    }
    response.data.businesses.map(
      (item) => this.isValidItem(item) && this.itemsSearched.set(item.id, item)
    );
  }

  async addItem(item: Item): Promise<void> {
    await axios.post(`${serverPrefix}/item`, {
      groupId: this.roomId,
      item: {
        itemId: item.id,
        imgURL: item.imgURL,
        name: item.name,
        itemURL: item.itemURL,
      },
    });
  }

  private isValidItem(item: Item): boolean {
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
