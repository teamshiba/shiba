import React from "react";
import { render, screen } from "@testing-library/react";
import Voting, { __testExports } from "./index";
import { MemoryRouter, Route } from "react-router";
import { groupStore } from "../../stores/group-store";
import { statisticsStore } from "../../stores/statistics-store";
import { VotingItem } from "../../domain/voting-item";

const { ResultScreen } = __testExports;

jest.mock("../../stores/group-store");
jest.mock("../../stores/voting-store");
jest.mock("../../stores/statistics-store");

jest.mock("react-tinder-card", () => (props: any) => (
  <>
    <button onClick={() => props.onSwipe("left")}>Swipe Left</button>
    <button onClick={() => props.onSwipe("right")}>Swipe Right</button>
    <button onClick={() => props.onSwipe("up")}>Swipe Up</button>
    {props.children}
  </>
));

test("renders", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Voting} />
    </MemoryRouter>
  );

  const title = screen.queryByText(/Test Group 1234/i);
  expect(title).toBeInTheDocument();

  const item = screen.queryByText(/Item 1/i);
  expect(item).toBeInTheDocument();
});

test("renders completed (no match)", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Voting} />
    </MemoryRouter>
  );

  const groupProfileStore = groupStore.room("1234");

  if (!groupProfileStore.data) {
    throw new Error("Invariant violated");
  }

  groupProfileStore.data.isCompleted = true;
  groupProfileStore.data.members.push(null as any);

  const message = screen.queryByText(/No Match/i);
  expect(message).toBeInTheDocument();
});

test("renders completed (with a match)", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Voting} />
    </MemoryRouter>
  );

  const groupProfileStore = groupStore.room("1234");

  if (!groupProfileStore.data) {
    throw new Error("Invariant violated");
  }

  groupProfileStore.data.isCompleted = true;

  const message = screen.queryByText(/A Match/i);
  expect(message).toBeInTheDocument();
});

test("renders completed (with multiple matches)", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Voting} />
    </MemoryRouter>
  );

  const groupProfileStore = groupStore.room("1234");
  const statStore = statisticsStore.room("1234");

  if (!groupProfileStore.data) {
    throw new Error("Invariant violated");
  }

  groupProfileStore.data.isCompleted = true;
  statStore.statistics.push({
    items: {
      itemId: "mock1",
      name: "Mock Item 1",
      itemURL: "https://example.com/test-item",
    } as VotingItem,
    like: 1,
    dislike: 2,
  });

  const message = screen.queryByText(/Matches/i);
  expect(message).toBeInTheDocument();
});

test("result screen", async () => {
  const handleGotoStats = jest.fn();

  render(
    <ResultScreen
      items={
        [
          { itemId: "item1", name: "item1" },
          { itemId: "item2", name: "item2" },
        ] as any
      }
      onGotoStats={handleGotoStats}
    />
  );

  const getFirstItem = () => screen.queryAllByText(/item/)[0].textContent;
  const swipe = (text: RegExp) => screen.getAllByText(text)[0].click();

  expect(getFirstItem()).toBe("item1");
  swipe(/Swipe Right/);
  expect(getFirstItem()).toBe("item2");
  swipe(/Swipe Right/);
  expect(getFirstItem()).toBe("item1");
  swipe(/Swipe Left/);
  expect(getFirstItem()).toBe("item2");
  swipe(/Swipe Left/);
  expect(getFirstItem()).toBe("item1");
});
