import React from 'react';
import {render, screen} from '@testing-library/react';
import Card from "./Card";

test("renders user name", async () => {
    render(<Card title="This is title">This is content</Card>)
    ;

    const title = screen.queryByText(/This is title/i);
    expect(title).toBeInTheDocument();

    const content = screen.queryByText(/This is content/i);
    expect(content).toBeInTheDocument();
});

