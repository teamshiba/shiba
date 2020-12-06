import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddItems from "./index";
import { MemoryRouter, Route } from "react-router";
import { itemStore } from "../../stores/item-store";

jest.mock("../../stores/item-store");
jest.mock("../../stores/group-store");

// Mock geolocation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window.navigator.geolocation as any) = {
  getCurrentPosition: (callback: (pos: GeolocationPosition) => void) =>
    callback({
      coords: {
        latitude: 0,
        longitude: 0,
      },
    } as GeolocationPosition),
};

test("renders recommendation", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={AddItems} />
    </MemoryRouter>
  );

  expect(screen.queryByText(/Recommended Item/)).toBeInTheDocument();
});

test("renders search result", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={AddItems} />
    </MemoryRouter>
  );

  const elements = document.getElementsByTagName("input");
  expect(elements.length).toBe(1);

  const searchBar = elements[0];
  userEvent.type(searchBar, "some restaurant");
  await new Promise((r) => setTimeout(() => r(null), 1500));

  expect(
    screen.queryByText(/Searched Item: some restaurant/)
  ).toBeInTheDocument();
});

test("add item", async () => {
  const itemListStore = itemStore.room("1234");
  const spy = jest.spyOn(itemListStore, "addItem");

  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={AddItems} />
    </MemoryRouter>
  );

  const elements = document.getElementsByTagName("button");
  const button = elements[1];

  button.click();

  expect(spy).toBeCalled();
});
