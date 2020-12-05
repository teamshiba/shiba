import { VotingItem } from "./voting-item";

export interface Statistics {
  like: number;
  dislike: number;
  items: VotingItem;
}
