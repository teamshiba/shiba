import React from "react";
import { render, screen } from "@testing-library/react";
import Voting, { __testExports } from "./index";
import { MemoryRouter, Route } from "react-router";
import { groupStore } from "../../stores/group-store";
import { statisticsStore } from "../../stores/statistics-store";
import { VotingItem } from "../../domain/voting-item";
import userEvent from "@testing-library/user-event";
import { browserHistory } from "../../common/utils";
import { votingStore } from "../../stores/voting-store";

const { ResultScreen, VotingScreen } = __testExports;

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
      itemId: "mock2",
      name: "Mock Item 2",
      itemURL: "https://example.com/test-item2",
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
  swipe(/Swipe Up/);
  expect(getFirstItem()).toBe("item1");
});

test("voting screen", async () => {
  const handleVote = jest.fn();
  const handleGotoStats = jest.fn();
  const handleGotoAdd = jest.fn();

  render(
    <VotingScreen
      items={[{ itemId: "item1", name: "item1" } as VotingItem]}
      totalCount={1}
      onVote={handleVote}
      onGotoStats={handleGotoStats}
      onGotoAdd={handleGotoAdd}
    />
  );

  expect(screen.queryByText(/item1/i)).toBeInTheDocument();

  const [
    infoButton,
    statButton,
    dislikeButton,
    likeButton,
    addButton,
  ] = document.querySelectorAll('button[type="button"]');

  window.open = jest.fn();
  userEvent.click(infoButton);
  expect(window.open).toBeCalled();

  userEvent.click(statButton);
  expect(handleGotoStats).toBeCalled();

  userEvent.click(dislikeButton);
  expect(handleVote).toBeCalledWith("item1", "dislike");

  userEvent.click(likeButton);
  expect(handleVote).toBeCalledWith("item1", "like");

  userEvent.click(addButton);
  expect(handleGotoAdd).toBeCalled();
});

test("voting screen (with no items)", async () => {
  const handleVote = jest.fn();
  const handleGotoStats = jest.fn();
  const handleGotoAdd = jest.fn();

  render(
    <VotingScreen
      items={[]}
      totalCount={1}
      onVote={handleVote}
      onGotoStats={handleGotoStats}
      onGotoAdd={handleGotoAdd}
    />
  );

  expect(screen.queryByText(/click add button/i)).toBeInTheDocument();
  expect(screen.queryByText(/wait for other people/i)).toBeInTheDocument();

  const [
    statButton,
    dislikeButton,
    likeButton,
    addButton,
  ] = document.getElementsByTagName("button");

  statButton.click();
  expect(handleGotoStats).toBeCalled();

  dislikeButton.click();
  expect(handleVote).not.toBeCalled();

  likeButton.click();
  expect(handleVote).not.toBeCalled();

  addButton.click();
  expect(handleGotoAdd).toBeCalled();
});

test("voting screen (fresh group)", async () => {
  const handle = () => null;

  render(
    <VotingScreen
      items={[]}
      totalCount={0}
      onVote={handle}
      onGotoStats={handle}
      onGotoAdd={handle}
    />
  );

  expect(screen.queryByText(/click add button/i)).toBeInTheDocument();
  expect(screen.queryByText(/wait for other people/i)).not.toBeInTheDocument();
});

test("click room profile button", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Voting} />
    </MemoryRouter>
  );

  const iconButton = document.getElementsByTagName("button")[1];

  const spy = jest.spyOn(browserHistory, "push");

  iconButton.click();
  expect(spy).toBeCalled();
});

test("result screen vote by click", async () => {
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

  const dislikeButton = document.getElementsByTagName("button")[9];
  const likeButton = document.getElementsByTagName("button")[10];
  const getFirstItem = () => screen.queryAllByText(/item/)[0].textContent;

  expect(getFirstItem()).toBe("item1");
  dislikeButton.click();
  expect(getFirstItem()).toBe("item2");
  likeButton.click();
});

test("No more items to swipe", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Voting} />
    </MemoryRouter>
  );

  const roomVotingStore = votingStore.room("1234");

  await roomVotingStore.vote("item1", "like");
  expect(roomVotingStore.items.size).toBe(0);
});
