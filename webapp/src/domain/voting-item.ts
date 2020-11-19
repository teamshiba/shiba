export interface VotingItem {
    id: string
    name: string
    imgURL: string
    location: string
}

export interface VotingItemResponse {
    roomTotal: number;
    items: VotingItem[];
}