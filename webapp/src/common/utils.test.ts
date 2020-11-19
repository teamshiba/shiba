import { getOrCreate } from "./utils";

test("get or create", () => {
  const map = new Map<string, string>();
  const value = getOrCreate(map, "a", () => "a");
  expect(value).toBe("a");
  expect(map.get("a")).toBe("a");

  const value2 = getOrCreate(map, "a", () => "b");
  expect(value2).toBe("a");
  expect(map.get("a")).toBe("a");
});
