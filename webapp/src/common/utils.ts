import { createBrowserHistory } from "history";

/**
 * @desc helper functions.
 */

const browserHistory = createBrowserHistory();

// From https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
export const copyToClipboard = (text: string): void => {
  const textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  if (window.navigator.platform === "iPhone") {
    textField.setSelectionRange(0, 99999);
  } else {
    textField.select();
  }
  document.execCommand("copy");
  textField.remove();
};

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

export { browserHistory };
