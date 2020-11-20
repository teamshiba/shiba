import React from "react";
import { render, screen } from "@testing-library/react";
import Invitation from "./index";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../stores/group-store");

test("renders", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Invitation} />
    </MemoryRouter>
  );

  const title = screen.queryByText(/Test Group 1234/i);
  expect(title).toBeInTheDocument();

  const member = screen.queryByText(/User in 1234/i);
  expect(member).toBeInTheDocument();

  const okButton = screen.queryByText(/Sure/i);
  expect(okButton).toBeInTheDocument();

  const rejectButton = screen.queryByText(/No/i);
  expect(rejectButton).toBeInTheDocument();
});
