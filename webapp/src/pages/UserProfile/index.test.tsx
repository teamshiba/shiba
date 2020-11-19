import React from 'react';
import {render, screen} from '@testing-library/react';
import UserProfile from "./index";

jest.mock("../../stores/user-store");

test("renders", async () => {
    render(<UserProfile/>);

    const username = screen.queryByDisplayValue(/Test User/i);
    expect(username).toBeInTheDocument();

    const signOutButton = screen.queryByText(/Sign Out/i);
    expect(signOutButton).toBeInTheDocument();
});

