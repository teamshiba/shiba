/**
 * @desc the results of a matching process.
 */

import React, {FC, Fragment, useState} from "react";
import Header from "../../components/Header";
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TinderCard from 'react-tinder-card'



const Statistics: FC = () => {
    return (
        <Fragment>
            <Header hasBackButton buttons={[
                <IconButton> <EditOutlinedIcon/> </IconButton>
            ]}>
                Group Name
            </Header>

            Stats

        </Fragment>
    )
}

export default Statistics;