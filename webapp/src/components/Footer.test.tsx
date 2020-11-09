import React from 'react';
import {History} from "history";
import { render, screen } from '@testing-library/react';
import Footer from "./Footer";

test('renders learn react link', () => {
  const fakeHistory = {
    push: () => undefined,
    location: {
      pathname: "/user/profile"
    }
  };
  render(<Footer history={fakeHistory as unknown as History} />);
});