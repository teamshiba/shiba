/**
 * @desc the results of a matching process.
 */

import React, {FC, Fragment, useContext, useState} from "react";
import Header from "../../components/Header";
import GroupStore from "../../stores/group-store";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";


type IProps = RouteComponentProps<{ id: string }>

const Statistics: FC<IProps> = observer((props) => {
    const roomId = props.match.params['id'];
    const groupDetailStore = useContext(GroupStore).room(roomId);
    return (
        <Fragment>
            <Header hasBackButton>
                Group Name
            </Header>

            Stats

        </Fragment>
    )
})

export default Statistics;