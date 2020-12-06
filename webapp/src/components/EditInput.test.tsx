import React from "react";
import { render, screen } from "@testing-library/react";
import EditInput from "./EditInput";
import userEvent from "@testing-library/user-event";

test("renders", async () => {
  render(<EditInput value={"Hello, World"} onSubmit={() => null} />);
  const elem = screen.queryByDisplayValue(/Hello, World/i);
  expect(elem).toBeInTheDocument();
});

test("edit", async () => {
  const handleSubmit = jest.fn();
  render(<EditInput value="" onSubmit={handleSubmit} />);

  const startEditButton = document.getElementsByTagName("button")[0];
  startEditButton.click();

  const input = document.getElementsByTagName("input")[0];
  userEvent.type(input, "new value");

  expect(handleSubmit).not.toBeCalled();

  const submitButton = document.getElementsByTagName("button")[0];
  submitButton.click();

  expect(handleSubmit).toBeCalledWith("new value");
});
