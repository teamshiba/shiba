/**
 * @desc Homepage. List of matching rooms.
 */

import React, {FC} from "react";
import Header from "../../components/Header";
import ShibaLogo from "../../components/ShibaLogo";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

const RoomList: FC = () => {
    return <Header buttons={<IconButton> <AddIcon/> </IconButton>}>
        <ShibaLogo/>
    </Header>
}

export default RoomList;