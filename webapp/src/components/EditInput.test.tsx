import React from 'react';
import {render, screen} from '@testing-library/react';
import EditInput from "./EditInput";

test("renders", async () => {
    render(<EditInput value={"Hello, World"} onSubmit={() => null}/>);
    const elem = screen.queryByDisplayValue(/Hello, World/i);
    expect(elem).toBeInTheDocument();
});

