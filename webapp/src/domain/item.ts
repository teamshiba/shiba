export interface Item {
  id: string;
  imgURL: string;
  itemURL: string;
  name: string;
  rating: number;
  categories: [{ alias: string; title: string }];
}

export interface ItemResponse {
  businesses: Item[];
}
