/**
 * @desc authentication page.
 */

import React, { FC } from "react";
import Box from '@material-ui/core/Box';

import SignIn from "./SignIn";
import ShibaLogo from "../../components/ShibaLogo";
import Header from "../../components/Header";

const Authentication: FC = () => {
    return (
        <>
            <Header>
                <ShibaLogo/>
            </Header>
            <div>
                <Box
                    display="flex"
                    alignItems="center">
                    <SignIn/>
                </Box>
            </div>
        </>

    );
};

export default Authentication;
