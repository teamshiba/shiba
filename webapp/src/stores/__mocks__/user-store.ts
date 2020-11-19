import { makeAutoObservable } from "mobx";
import { User } from "../../domain/user";

class UserStore {
  user = {
    userId: "1234",
    displayName: "Test User",
    email: "test@test.com",
  } as User;

  initialized = false;

  constructor() {
    makeAutoObservable(this);
  }
}

export const userStore = new UserStore();
