import React from "react";
import { render, screen } from "@testing-library/react";
import AvatarList from "./AvatarList";
import { User } from "../domain/user";
import userEvent from "@testing-library/user-event";

test("renders user name", async () => {
  render(
    <AvatarList
      members={[
        {
          userId: "uid1",
          displayName: "Test User1",
        } as User,
        {
          userId: "uid2",
          displayName: "Test User2",
        } as User,
      ]}
    />
  );

  const elem1 = screen.queryByText(/Test User1/i);
  expect(elem1).toBeInTheDocument();

  const elem2 = screen.queryByText(/Test User2/i);
  expect(elem2).toBeInTheDocument();
});

test("calls back", async () => {
  const user = {
    userId: "uid1",
    displayName: "Test User1",
  } as User;

  const handleClick = jest.fn();

  render(<AvatarList members={[user]} onClick={handleClick} />);

  const avatar = document.querySelector(".MuiAvatar-root");
  avatar && userEvent.click(avatar);

  expect(handleClick).toBeCalled();
});
