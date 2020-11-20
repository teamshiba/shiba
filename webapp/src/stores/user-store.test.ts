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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return userRef as any;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedAuth.onAuthStateChanged.mockImplementation((async (callback: any) => {
      const res = await callback({
        ...mockUser,
        getIdToken: async () => "token",
      } as firebase.User);
      resolve(true);
      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any);

    new UserStore();
  });

  await initPromise;

  expect(setUserCalled).toBeTruthy();
});

test("rename", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockedAuth.onAuthStateChanged.mockImplementation((() => null) as any);
  const userStore = new UserStore();

  const mockUser = {
    uid: "user1",
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return userRef as any;
  });

  await userStore.rename(newName);

  expect(updateCalled).toBeTruthy();
});
