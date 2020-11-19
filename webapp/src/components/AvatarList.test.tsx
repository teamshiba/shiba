import React from 'react';
import {render, screen} from '@testing-library/react';
import AvatarList from "./AvatarList";
import {User} from "../domain/user";

test("renders user name", async () => {
    render(<AvatarList members={[
        {
            uid: "uid1",
            displayName: "Test User1",
        } as User, {
            uid: "uid2",
            displayName: "Test User2",
        } as User,
    ]}/>)
    ;

    const elem1 = screen.queryByText(/Test User1/i);
    expect(elem1).toBeInTheDocument();

    const elem2 = screen.queryByText(/Test User2/i);
    expect(elem2).toBeInTheDocument();
});

