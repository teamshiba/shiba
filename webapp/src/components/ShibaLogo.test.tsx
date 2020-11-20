import React from "react";
import { render } from "@testing-library/react";
import ShibaLogo from "./ShibaLogo";

test("renders", async () => {
  const result = render(<ShibaLogo />);
  const elem = result.baseElement.querySelector('img[src="/shiba-logo.png"]');
  expect(elem).not.toBeNull();
});
