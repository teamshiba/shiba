export interface VotingItem {
  itemId: string;
  imgURL: string;
  itemURL: string;
  name: string;
  rating: number;
  categories: [{ alias: string; title: string }];
}

export interface SearchResponseItem {
  id: string;
  imgURL: string;
  itemURL: string;
  name: string;
  rating: number;
  categories: [{ alias: string; title: string }];
}

export interface SearchResponse {
  businesses: SearchResponseItem[];
}

export interface VotingItemResponse {
  roomTotal: number;
  items: VotingItem[];
}
