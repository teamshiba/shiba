/**
 * @desc authentication page.
 */

import React, {FC, useEffect} from "react";
import Box from '@material-ui/core/Box';

import SignIn from "./SignIn";
import ShibaLogo from "../../components/ShibaLogo";
import Header from "../../components/Header";
import {browserHistory} from "../../common/utils";

const Authentication: FC = () => {
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token && token.length > 0) {
            browserHistory.push("/room/active");
        }
    }, []);

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
