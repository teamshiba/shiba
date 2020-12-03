import axios from "axios";
import { ItemStore } from "./item-store";
import { VotingItem } from "../domain/voting-item";

jest.mock("./user-store");
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

test("add item", async () => {
  const itemStore = new ItemStore();
  const roomId = "1234";
  const roomVotingStore = itemStore.room(roomId);
  const mockItem = {
    itemId: "item1",
    name: "mock item",
  } as VotingItem;

  let postCalled = false;

  mockedAxios.post.mockImplementationOnce(async (path, data) => {
    postCalled = true;
    expect(path).toContain("/item");
    expect(data).toStrictEqual({
      groupId: "1234",
      item: mockItem,
    });
  });

  await roomVotingStore.addItem(mockItem);
  expect(postCalled).toBeTruthy();
});
