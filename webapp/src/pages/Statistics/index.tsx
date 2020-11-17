/**
 * @desc the results of a matching process.
 */

import React, {FC, Fragment, useContext, useEffect, useState} from "react";
import Header from "../../components/Header";
import StatisticsStore from "../../stores/statistics-store";
import GroupStore from "../../stores/group-store";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";


type IProps = RouteComponentProps<{ id: string }>

const Statistics: FC<IProps> = observer((props) => {
    const roomId = props.match.params['id'];
    const statisticsStore = useContext(StatisticsStore).room(roomId);
    const groupDetailStore = useContext(GroupStore).room(roomId);

    useEffect(() => {
        statisticsStore.updateStatistics();
        groupDetailStore.update();
    }, []);

    return (
        <Fragment>
            <Header hasBackButton>
                { groupDetailStore.data?.roomName }
            </Header>

            {
                statisticsStore.statistics.map(stat => <p>{stat.item.name}</p>)
            }

        </Fragment>
    )
})

export default Statistics;