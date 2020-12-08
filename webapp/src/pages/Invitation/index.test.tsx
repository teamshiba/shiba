import React from "react";
import { render, screen } from "@testing-library/react";
import Invitation from "./index";
import { MemoryRouter, Route } from "react-router";
import { browserHistory } from "../../common/utils";

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

test("accept invitation", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Invitation} />
    </MemoryRouter>
  );

  const okButton = document.getElementsByTagName("button")[2];

  const spy = jest.spyOn(browserHistory, "push");
  okButton.click();
  expect(spy).toBeCalled();
});

test("decline invitation", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={Invitation} />
    </MemoryRouter>
  );

  const rejectButton = document.getElementsByTagName("button")[1];

  const spy = jest.spyOn(browserHistory, "push");
  rejectButton.click();
  expect(spy).toBeCalled();
});
