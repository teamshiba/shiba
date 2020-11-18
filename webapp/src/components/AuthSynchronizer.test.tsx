import React from 'react';
import {render, screen} from '@testing-library/react';
import AuthSynchronizer from "./AuthSynchronizer";
import {userStore} from "../stores/user-store";

jest.mock("../stores/user-store");

const component = <AuthSynchronizer>
    <div>Hello World</div>
</AuthSynchronizer>;

test("doesn't render if not initialized", async () => {
    userStore.initialized = false;
    render(component);
    const helloWorld = screen.queryByText(/Hello World/i);
    expect(helloWorld).toBeNull();
});

test("renders if initialized", async () => {
    userStore.initialized = true;
    render(component);
    const helloWorld = screen.queryByText(/Hello World/i);
    expect(helloWorld).not.toBeNull();
});

