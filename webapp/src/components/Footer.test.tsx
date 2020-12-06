import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { History } from "history";

jest.mock("@material-ui/core/BottomNavigation", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      Value: {props.value}
      <button onClick={() => props.onChange(0)}>Test Change</button>
    </div>
  ),
}));

function fakeHistory(path: string): History {
  return ({
    location: {
      pathname: path,
    },
    push: () => null,
  } as unknown) as History;
}

test("highlights rooms", async () => {
  render(<Footer history={fakeHistory("/room/active")} />);

  const elem = screen.queryByText(/value: 0/i);
  expect(elem).toBeInTheDocument();
});

test("highlights history", async () => {
  render(<Footer history={fakeHistory("/room/history")} />);

  const elem = screen.queryByText(/value: 1/i);
  expect(elem).toBeInTheDocument();
});

test("highlights profile", async () => {
  render(<Footer history={fakeHistory("/user/profile")} />);

  const elem = screen.queryByText(/value: 2/i);
  expect(elem).toBeInTheDocument();
});

test("changes router", async () => {
  const history = fakeHistory("/user/profile");
  history.push = jest.fn();

  render(<Footer history={history} />);

  screen.getByText(/Test Change/i).click();
  expect(history.push).toBeCalled();
});
