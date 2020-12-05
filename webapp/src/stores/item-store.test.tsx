import axios from "axios";
import { ItemStore } from "./item-store";
import { SearchResponseItem, VotingItem } from "../domain/voting-item";

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

test("search recommended item", async () => {
  const itemStore = new ItemStore();
  const roomId = "1234";
  const roomItemStore = itemStore.room(roomId);
  const mockItem = {
    id: "item1",
    name: "mock item",
    categories: [{ alias: "item1", title: "item1" }],
  } as SearchResponseItem;
  const location = "NYC";
  const term = "";
  const latitude = -1;
  const longitude = -1;

  let getCalled = false;

  mockedAxios.get.mockImplementationOnce(async (path) => {
    getCalled = true;
    expect(path).toContain(`/item/search?location=${location}`);
    return {
      data: {
        businesses: [mockItem],
      },
    };
  });

  await roomItemStore.search(term, latitude, longitude);
  expect(roomItemStore.items.length).toBe(1);
  expect(getCalled).toBeTruthy();
});

test("search park item", async () => {
  const itemStore = new ItemStore();
  const roomId = "1234";
  const roomItemStore = itemStore.room(roomId);
  const mockItem = {
    id: "item1",
    name: "mock item",
    categories: [{ alias: "item-park", title: "item1" }],
  } as SearchResponseItem;
  const term = "Sushi";
  const latitude = 20;
  const longitude = 40;

  let getCalled = false;

  mockedAxios.get.mockImplementationOnce(async (path) => {
    getCalled = true;
    expect(path).toContain(
      `/item/search?latitude=${latitude}&longitude=${longitude}&term=${term}`
    );
    return {
      data: {
        businesses: [mockItem],
      },
    };
  });

  await roomItemStore.search(term, latitude, longitude);
  expect(roomItemStore.items.length).toBe(0);
  expect(getCalled).toBeTruthy();
});

test("search unexpected", async () => {
  const itemStore = new ItemStore();
  const roomId = "1234";
  const roomItemStore = itemStore.room(roomId);
  const term = "Sushi";
  const latitude = -50000;
  const longitude = -50000;

  let getCalled = false;

  mockedAxios.get.mockImplementationOnce(async (path) => {
    getCalled = true;
    expect(path).toContain(
      `/item/search?latitude=${latitude}&longitude=${longitude}&term=${term}`
    );
    return {
      status: 400,
    };
  });

  await roomItemStore.search(term, latitude, longitude);
  expect(roomItemStore.items.length).toBe(0);
  expect(getCalled).toBeTruthy();
});
