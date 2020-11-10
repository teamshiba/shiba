/**
 * @desc Public layout for many pages.
 */

import React, {FC} from "react";
import Footer from "./Footer";
import {Container} from "@material-ui/core";
import {browserHistory} from "../common/utils";

interface IProps {
    children: React.ReactNode
}

const Layout: FC<IProps> = (props) => {
    return <Container>
        {props.children}
        <Footer history={browserHistory}/>
    </Container>
}

export default Layout;