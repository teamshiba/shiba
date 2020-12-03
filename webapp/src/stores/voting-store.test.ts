import axios from "axios";
import { VotingStore } from "./voting-store";
import { VotingItem } from "../domain/voting-item";

jest.mock("./user-store");
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

async function updateItems() {
  const votingStore = new VotingStore();
  const roomId = "1234";
  const roomVotingStore = votingStore.room(roomId);
  const mockItem = {
    itemId: "item1",
    name: "mock item",
  };

  mockedAxios.get.mockImplementationOnce(async (path) => {
    expect(path).toContain("/item/");

    return {
      data: { roomTotal: 1, items: [mockItem] },
    };
  });

  await roomVotingStore.updateItems();

  return roomVotingStore;
}

test("updates items", async () => {
  const roomVotingStore = await updateItems();

  expect(roomVotingStore.totalCount).toBe(1);
  expect(roomVotingStore.unvotedCount).toBe(1);
  expect(roomVotingStore.items.get("item1")?.name).toBe("mock item");
});

// test("add item", async () => {
//   const votingStore = new VotingStore();
//   const roomId = "1234";
//   const roomVotingStore = votingStore.room(roomId);
//   const mockItem = {
//     itemId: "item1",
//     name: "mock item",
//   } as VotingItem;
//
//   let postCalled = false;
//
//   mockedAxios.post.mockImplementationOnce(async (path, data) => {
//     postCalled = true;
//     expect(path).toContain("/item");
//     expect(data).toStrictEqual({
//       groupId: "1234",
//       item: mockItem,
//     });
//   });
//
//   await roomVotingStore.addItem(mockItem);
//   expect(postCalled).toBeTruthy();
// });

test("vote", async () => {
  const roomVotingStore = await updateItems();

  mockedAxios.put.mockImplementationOnce(async (path, data) => {
    expect(path).toContain("/voting");
    expect(data.itemId).toBe("item1");
    expect(data.type).toBe(1);

    return {
      data: { roomTotal: 1, items: [] },
    };
  });

  await roomVotingStore.vote("item1", "like");

  expect(roomVotingStore.totalCount).toBe(1);
  expect(roomVotingStore.unvotedCount).toBe(0);
});
