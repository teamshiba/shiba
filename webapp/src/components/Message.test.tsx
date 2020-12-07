import React from "react";
import { render, screen } from "@testing-library/react";
import Message from "./Message";

test("renders", async () => {
  render(<Message>Hello, World</Message>);
  expect(screen.queryByText(/Hello, World/)).toBeInTheDocument();
});
