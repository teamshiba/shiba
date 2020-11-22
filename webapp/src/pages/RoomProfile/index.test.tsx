import React from "react";
import { render, screen } from "@testing-library/react";
import RoomProfile from "./index";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../stores/group-store");
jest.mock("../../stores/user-store");

test("renders", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={RoomProfile} />
    </MemoryRouter>
  );

  const title = screen.queryByText(/Test Group 1234/i);
  expect(title).toBeInTheDocument();

  const member = screen.queryByText(/User in 1234/i);
  expect(member).toBeInTheDocument();

  const link = screen.queryByDisplayValue(/\/join\/1234/i);
  expect(link).toBeInTheDocument();

  const endMatchButton = screen.queryByText(/End this match/i);
  expect(endMatchButton).toBeInTheDocument();
});
