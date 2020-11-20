import React from "react";
import { render, screen } from "@testing-library/react";
import { ActiveRoomList, HistoryRoomList } from "./index";

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
