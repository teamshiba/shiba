import {User} from "./user";

export interface Group {
    groupId: number
    roomName: string,
    isCompleted: boolean;
    members: User[];
}