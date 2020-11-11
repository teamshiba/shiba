/**
 * @desc authentication page.
 */

import React, { FC } from "react";
import Box from '@material-ui/core/Box';
// import Header from "../../components/Header";

import SignIn from "./SignIn";

const Authentication: FC = () => {
    return (
        <div style={{height: "100vh"}}>
            <Box
                display="flex"
                alignItems="center">
                <SignIn />
            </Box>
        </div>

    );
};

export default Authentication;
