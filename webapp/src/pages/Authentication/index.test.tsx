import React from "react";
import { render, screen } from "@testing-library/react";
import Authentication from "./index";
import { browserHistory } from "../../common/utils";

jest.mock("react-firebaseui", () => ({
  StyledFirebaseAuth: () => <div>Mock</div>,
}));

test("renders", async () => {
  localStorage.removeItem("auth_token");
  render(<Authentication />);

  const signIn = screen.queryByText(/Sign in/i);
  expect(signIn).toBeInTheDocument();
});

test("redirects if logged in", async () => {
  const spy = jest.spyOn(browserHistory, "push");

  localStorage.setItem("auth_token", "test token");
  render(<Authentication />);

  expect(spy).toBeCalled();
});
