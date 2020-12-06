import React from "react";
import { render, screen } from "@testing-library/react";
import RoomProfile, { __testExports } from "./index";
import { MemoryRouter, Route } from "react-router";
import { User } from "../../domain/user";
import { sleep } from "../../common/utils";

const { GroupAvatarList } = __testExports;

jest.mock("../../stores/group-store");
jest.mock("../../stores/user-store");

test("renders", async () => {
  render(
    <MemoryRouter initialEntries={["/1234"]}>
      <Route path="/:id" component={RoomProfile} />
    </MemoryRouter>
  );

  const title = screen.queryByText(/Test Group 1234/i);
  expect(title).toBeInTheDocument();

  const member = screen.queryByText(/User in 1234/i);
  expect(member).toBeInTheDocument();

  const link = screen.queryByDisplayValue(/\/join\/1234/i);
  expect(link).toBeInTheDocument();

  const endMatchButton = screen.queryByText(/End this match/i);
  expect(endMatchButton).toBeInTheDocument();
});

jest.mock("../../components/AvatarList", () => (props: any) => (
  <>
    {props.members.map((m: User) => (
      <div
        key={m.userId}
        onClick={(ev) => props.onClick && props.onClick(ev, m)}
      >
        {m.displayName}
      </div>
    ))}
  </>
));

jest.mock("material-ui-confirm", () => ({
  ConfirmProvider: (props: any) => <>{props.children}</>,
  useConfirm: () => async () => null,
}));

test("don't open menu for non-organizer", async () => {
  render(
    <GroupAvatarList
      organizerUID="1234"
      currentUID="1235"
      members={[
        {
          userId: "1234",
          displayName: "1234",
        } as User,
        {
          userId: "1235",
          displayName: "1235",
        } as User,
      ]}
      onMakeOrganizer={() => null}
      onRemoveUser={() => null}
    />
  );

  screen.getByText("1235").click();
  expect(screen.queryByText(/Remove/)).toBeNull();
});

test("open menu for organizer (but not himself)", async () => {
  const handleMakeOrganizer = jest.fn();
  const handleRemoveUser = jest.fn();

  render(
    <GroupAvatarList
      organizerUID="1234"
      currentUID="1234"
      members={[
        {
          userId: "1234",
          displayName: "1234",
        } as User,
        {
          userId: "1235",
          displayName: "1235",
        } as User,
      ]}
      onMakeOrganizer={handleMakeOrganizer}
      onRemoveUser={handleRemoveUser}
    />
  );

  screen.getByText("1234").click();
  expect(screen.queryByText(/Remove/)).toBeNull();

  screen.getByText("1235").click();
  screen.getByText(/Organizer/).click();
  await sleep(1000); // Make sure promises are resolved
  expect(handleMakeOrganizer).toBeCalled();

  screen.getByText("1235").click();
  screen.getByText(/Remove/).click();
  await sleep(1000); // Make sure promises are resolved
  expect(handleRemoveUser).toBeCalled();
});
