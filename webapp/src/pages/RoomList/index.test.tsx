import React from "react";
import { render, screen } from "@testing-library/react";
import { ActiveRoomList, HistoryRoomList, __testExports } from "./index";
import { browserHistory, sleep } from "../../common/utils";
import userEvent from "@testing-library/user-event";
import { groupStore } from "../../stores/group-store";

const { CreateGroupModal } = __testExports;

jest.mock("../../stores/group-store");

test("renders active rooms", async () => {
  render(<ActiveRoomList />);

  const group1 = screen.queryByText(/Test Group 1/i);
  expect(group1).toBeInTheDocument();

  const group2 = screen.queryByText(/Test Group 2/i);
  expect(group2).toBeInTheDocument();
});

test("renders history rooms", async () => {
  render(<HistoryRoomList />);

  const group3 = screen.queryByText(/Test Group 3/i);
  expect(group3).toBeInTheDocument();

  const group4 = screen.queryByText(/Test Group 4/i);
  expect(group4).toBeInTheDocument();
});

test("jumps to group detail", async () => {
  render(<ActiveRoomList />);

  const spy = jest.spyOn(browserHistory, "push");
  const group1 = screen.getByText(/Test Group 1/i);
  group1.click();

  expect(spy).toBeCalledWith("/room/groupId1");
});

test("opens/closes create group modal", async () => {
  render(<ActiveRoomList />);

  expect(screen.queryByText(/Create Group/i)).toBeNull();

  const button = document.getElementsByTagName("button")[0];
  button.click();

  expect(screen.queryByText(/Create Group/i)).toBeInTheDocument();

  const cancelButton = screen.getByText(/Cancel/);
  cancelButton.click();

  // Somehow it needs some time to dismiss the dialogue
  await sleep(1000);

  expect(screen.queryByText(/Create Group/i)).toBeNull();
});

test("modal creates a group", async () => {
  render(<CreateGroupModal isOpen={true} handleClose={() => null} />);

  const spy = jest.spyOn(groupStore, "createGroup");

  const input = document.getElementsByTagName("input")[0];
  userEvent.type(input, "New Group Name");

  screen.getByText(/Create!/).click();

  expect(spy).toBeCalledWith("New Group Name");
});
