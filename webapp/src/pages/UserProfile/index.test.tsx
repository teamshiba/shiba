import React from "react";
import { render, screen } from "@testing-library/react";
import UserProfile from "./index";
import { browserHistory } from "../../common/utils";

jest.mock("../../stores/user-store");

test("renders", async () => {
  render(<UserProfile />);

  const username = screen.queryByDisplayValue(/Test User/i);
  expect(username).toBeInTheDocument();

  const signOutButton = screen.queryByText(/Sign Out/i);
  expect(signOutButton).toBeInTheDocument();
});

test("sign out", async () => {
  const historySpy = jest.spyOn(browserHistory, "push");
  localStorage.setItem("auth_token", "test_token");
  render(<UserProfile />);

  screen.getByText(/Sign Out/i).click();

  expect(historySpy).toBeCalled();
  expect(localStorage.getItem("auth_token")).toBeFalsy();
});
