import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { browserHistory } from "../common/utils";

test("renders", async () => {
  render(<Header>Title</Header>);
  const elem = screen.queryByText(/Title/i);
  expect(elem).toBeInTheDocument();
});

test("back button", async () => {
  render(<Header hasBackButton>Title</Header>);

  const spy = jest.spyOn(browserHistory, "goBack");

  const backButton = document.getElementsByTagName("button")[0];
  backButton.click();

  expect(spy).toBeCalled();
});
