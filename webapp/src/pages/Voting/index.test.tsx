import React from "react";
import { render, screen } from "@testing-library/react";
import Voting from "./index";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../stores/group-store");
jest.mock("../../stores/voting-store");

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
