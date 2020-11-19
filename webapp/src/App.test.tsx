import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the page", () => {
  render(<App />);
  const descElement = screen.getByText(/find a restaurant or hotel/i);
  expect(descElement).toBeInTheDocument();
});

test("jumps to the auth page after click log in", () => {
  render(<App />);
  const button = screen.getByText(/log in/i);
  button.click();
  expect(window.location.pathname).toBe("/auth/");
});
