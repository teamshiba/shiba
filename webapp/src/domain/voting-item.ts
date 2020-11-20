export interface VotingItem {
  itemId: string;
  name: string;
  imgURL: string;
}

export interface VotingItemResponse {
  roomTotal: number;
  items: VotingItem[];
}
