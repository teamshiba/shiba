import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

test("renders", async () => {
  render(<Header>Title</Header>);
  const elem = screen.queryByText(/Title/i);
  expect(elem).toBeInTheDocument();
});
