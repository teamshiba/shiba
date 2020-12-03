export interface VotingItem {
  itemId: string;
  name: string;
  imgURL: string;
  itemURL: string;
}

export interface VotingItemResponse {
  roomTotal: number;
  items: VotingItem[];
}
