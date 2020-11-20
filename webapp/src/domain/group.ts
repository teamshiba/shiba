import { User } from "./user";

export interface Group {
  groupId: string;
  roomName: string;
  isCompleted: boolean;
  members: User[];
}
