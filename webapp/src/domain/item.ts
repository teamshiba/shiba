export interface Item {
  id: string;
  imgURL: string;
  itemURL: string;
  name: string;
  rating: number;
}

export interface ItemResponse {
  businesses: Item[];
}
