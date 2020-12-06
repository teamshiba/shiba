import { auth, firestore } from "../firebase";
import { UserStore } from "./user-store";
import { User } from "../domain/user";
import firebase from "firebase";

jest.mock("../firebase");

const mockedAuth = auth as jest.Mocked<typeof auth>;
const mockedFireStore = firestore as jest.Mocked<typeof firestore>;

test("initialize new user", async () => {
  let setUserCalled = false;

  const mockUser = {
    uid: "user1",
    displayName: "Test User",
    email: "test@test.com",
    photoURL: "fake",
  };

  const initPromise = new Promise((resolve) => {
    mockedFireStore.doc.mockImplementation(() => {
      const snapshot = {
        exists: false,
        data: () => mockUser,
      };

      const userRef = {
        get: async () => snapshot,
        set: async (obj: User) => {
          setUserCalled = true;
          expect(obj.displayName).toStrictEqual(mockUser.displayName);
          expect(obj.email).toStrictEqual(mockUser.email);
          expect(obj.photoURL).toStrictEqual(mockUser.photoURL);
        },
      };

      return userRef as any;
    });

    mockedAuth.onAuthStateChanged.mockImplementation((async (callback: any) => {
      const res = await callback({
        ...mockUser,
        getIdToken: async () => "token",
      } as firebase.User);
      resolve(true);
      return res;
    }) as any);

    new UserStore();
  });

  await initPromise;

  expect(setUserCalled).toBeTruthy();
});

test("getting existing user", async () => {
  const mockUser = {
    uid: "user1",
    displayName: "Test User",
    email: "test@test.com",
    photoURL: "fake",
  };

  let userStore: UserStore | null = null;

  const initPromise = new Promise((resolve) => {
    mockedFireStore.doc.mockImplementation(() => {
      const snapshot = {
        exists: true,
        data: () => mockUser,
      };

      const userRef = {
        get: async () => snapshot,
      };

      return userRef as any;
    });

    mockedAuth.onAuthStateChanged.mockImplementation((async (callback: any) => {
      const res = await callback({
        ...mockUser,
        getIdToken: async () => "token",
      } as firebase.User);
      resolve(true);
      return res;
    }) as any);

    userStore = new UserStore();
  });

  await initPromise;

  expect((userStore as any)?.user?.uid).toBe("user1");
});

test("not logged in", async () => {
  let userStore: UserStore | null = null;

  const initPromise = new Promise((resolve) => {
    mockedAuth.onAuthStateChanged.mockImplementation((async (callback: any) => {
      const res = await callback(null);
      resolve(true);
      return res;
    }) as any);

    userStore = new UserStore();
  });

  await initPromise;

  expect((userStore as any)?.user?.uid).toBeFalsy();
});

test("rename", async () => {
  mockedAuth.onAuthStateChanged.mockImplementation((() => null) as any);
  const userStore = new UserStore();

  const mockUser = {
    userId: "user1",
    displayName: "Test User",
    email: "test@test.com",
    photoURL: "fake",
  };

  const newName = "New Name";

  userStore.user = mockUser as User;

  let updateCalled = false;

  mockedFireStore.doc.mockImplementation(() => {
    const userRef = {
      update: async (obj: User) => {
        updateCalled = true;
        expect(obj.displayName).toStrictEqual(newName);
      },
    };

    return userRef as any;
  });

  await userStore.rename(newName);

  expect(updateCalled).toBeTruthy();
});
