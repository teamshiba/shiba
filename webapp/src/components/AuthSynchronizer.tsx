import React, {FC, useContext} from "react";
import {observer} from "mobx-react";
import UserStore from "../stores/user-store";

/*
 * Blocks rendering until firebase authentication finishes. This helps to avoid incorrect jumping to /auth/ when
 * what needed is merely token refreshing
 */
const AuthSynchronizer: FC = observer((props) => {
    const userStore = useContext(UserStore);
    if (!userStore.initialized) return null;

    return <React.Fragment>{props.children}</React.Fragment>;
})

export default AuthSynchronizer;