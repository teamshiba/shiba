import { createBrowserHistory } from "history";

/**
 * @desc helper functions.
 */

const browserHistory = createBrowserHistory();

export function getOrCreate<K, V>(
  map: Map<K, V>,
  key: K,
  factory: (key: K) => V
): V {
  const value = map.get(key);
  if (value) {
    return value;
  }

  const newValue = factory(key);
  map.set(key, newValue);
  return newValue;
}

export function createDebouncer(time: number): (func: () => void) => void {
  let timeout: number | null = null;
  return (func: () => void) => {
    if (timeout != null) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => func(), time);
  };
}

export const sleep = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

export { browserHistory };
