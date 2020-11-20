import React from "react";
import { render, screen } from "@testing-library/react";
import Statistics from "./index";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../stores/group-store");
jest.mock("../../stores/statistics-store");

test("renders", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Statistics} />
    </MemoryRouter>
  );

  const title = screen.queryByText(/Test Group 1234/i);
  expect(title).toBeInTheDocument();

  const item = screen.queryByText(/Mock Item 1/i);
  expect(item).toBeInTheDocument();
});
