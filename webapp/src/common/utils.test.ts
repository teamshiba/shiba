import { createDebouncer, getOrCreate, sleep } from "./utils";

test("get or create", () => {
  const map = new Map<string, string>();
  const value = getOrCreate(map, "a", () => "a");
  expect(value).toBe("a");
  expect(map.get("a")).toBe("a");

  const value2 = getOrCreate(map, "a", () => "b");
  expect(value2).toBe("a");
  expect(map.get("a")).toBe("a");
});

test("debounce", async () => {
  let triggered = false;
  const debounce = createDebouncer(100);
  const trigger = () => (triggered = true);

  for (let i = 0; i < 10; ++i) {
    debounce(trigger);
    await sleep(50);
    expect(triggered).toBeFalsy();
  }

  await sleep(100);
  expect(triggered).toBeTruthy();
});
