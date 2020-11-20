import React, { FC } from "react";
import { observer } from "mobx-react";
import { userStore } from "../stores/user-store";

/*
 * Blocks rendering until firebase authentication finishes. This helps to avoid incorrect jumping to /auth/ when
 * what needed is merely token refreshing
 */
const AuthSynchronizer: FC = observer((props) => {
  if (!userStore.initialized) return null;

  return <React.Fragment>{props.children}</React.Fragment>;
});

export default AuthSynchronizer;
