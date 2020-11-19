import React from 'react';
import {render, screen} from '@testing-library/react';
import Authentication from "./index";

jest.mock("react-firebaseui", () => ({
    StyledFirebaseAuth: () => <div>Mock</div>,
}));

test("renders", async () => {
    render(<Authentication/>);

    const signIn = screen.queryByText(/Sign in/i);
    expect(signIn).toBeInTheDocument();
});

