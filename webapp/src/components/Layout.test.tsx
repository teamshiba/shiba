import React from 'react';
import {render, screen} from '@testing-library/react';
import Layout from "./Layout";

test("renders", async () => {
    render(<Layout>Content</Layout>);
    const elem = screen.queryByText(/Content/i);
    expect(elem).toBeInTheDocument();
});

