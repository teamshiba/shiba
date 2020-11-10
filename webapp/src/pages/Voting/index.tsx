/**
 * @desc when user need to add items to the list for voting.
 */

import React, {FC} from "react";
import Header from "../../components/Header";
import IconButton from '@material-ui/core/IconButton';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

const Voting: FC = () => {
    return <Header hasBackButton buttons={[
        <IconButton> <AddOutlinedIcon/> </IconButton>,
        <IconButton> <EditOutlinedIcon/> </IconButton>
    ]}>
        Group Name
    </Header>
}

export default Voting;