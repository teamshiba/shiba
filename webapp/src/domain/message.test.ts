import { unwrap } from "./message";

test("unwrap success result", () => {
  expect(
    unwrap({
      status: "success",
      data: "Hello World",
    })
  ).toBe("Hello World");
});

test("unwrap error result", () => {
  expect(() => {
    unwrap({
      status: "error",
      msg: "something went wrong",
    });
  }).toThrow();
});
