/**
 * @desc user profile. users can edit their own profile. they can also log out here.
 */

import React, {FC, useContext} from "react";
import {observer} from "mobx-react";
import UserStore from "../../stores/user-store";

const UserProfile: FC = observer(() => {
    const userStore = useContext(UserStore);
    if (userStore.user == null) {
        return <div> Not logged in </div>;
    }

    return <div>
        UID: {userStore.user.uid}
    </div>
});

export default UserProfile;