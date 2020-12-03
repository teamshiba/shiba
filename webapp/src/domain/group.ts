import { User } from "./user";

export interface Group {
  groupId: string;
  roomName: string;
  isCompleted: boolean;
  organizerUid: string;
  itemList: string[];
  members: User[];
}
