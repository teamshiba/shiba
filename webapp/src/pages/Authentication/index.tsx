/**
 * @desc login page.
 */

import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import {Container} from "@material-ui/core";

export interface IProps
  extends RouteComponentProps<{ id?: string }> {
    id?: string;
}

const Authentication: FC<IProps> = props => {
    return (
        <Container>
            {props.match.url === "/auth/login" && (
                <div>Login</div>
            )}

            {props.match.url === "/auth/signup" && (
                <div>Sign up</div>
            )}
        </Container>
    );
};

export default Authentication;
