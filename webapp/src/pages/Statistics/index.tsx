/**
 * @desc the results of a matching process.
 */

import React, {FC, Fragment, useContext, useEffect, useState} from "react";
import Header from "../../components/Header";
import StatisticsStore from "../../stores/statistics-store";
import GroupStore from "../../stores/group-store";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from "@material-ui/core/styles/withStyles";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#FFBC6F',
  },
}))(LinearProgress);


type IProps = RouteComponentProps<{ id: string }>

const Statistics: FC<IProps> = observer((props) => {
    const roomId = props.match.params['id'];
    const statisticsStore = useContext(StatisticsStore).room(roomId);
    const groupDetailStore = useContext(GroupStore).room(roomId);
    const groupSize = groupDetailStore.data;

    useEffect(() => {
        statisticsStore.updateStatistics();
        groupDetailStore.update();
    }, []);

    return (
        <Fragment>
            <Header hasBackButton>
                { groupDetailStore.data?.roomName }
            </Header>

            <h3>Group picks</h3>
            {
                statisticsStore.statistics.map(stat => {
                    const progress = stat.like // ;

                    return (
                        <p>
                            {stat.item.name}
                            <BorderLinearProgress variant="determinate" value={progress}/>
                        </p>
                    )
                })
            }

        </Fragment>
    )
})


export default Statistics;