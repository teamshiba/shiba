/**
 * @desc the results of a matching process.
 */

import React, {FC, Fragment, useEffect} from "react";
import Header from "../../components/Header";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from "@material-ui/core/styles/withStyles";
import {groupStore} from "../../stores/group-store";
import {statisticsStore} from "../../stores/statistics-store";

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
    const roomStatisticsStore = statisticsStore.room(roomId);
    const groupDetailStore = groupStore.room(roomId);
    const groupSize = groupDetailStore.data?.members.length;

    useEffect(() => {
        roomStatisticsStore.updateStatistics();
        groupDetailStore.update();
    }, []);

    return (
        <Fragment>
            <Header hasBackButton>
                {groupDetailStore.data?.roomName}
            </Header>

            <h3>Top picks</h3>
            {
                roomStatisticsStore.statistics.map(stat => {
                    let progress = 0;
                    if (groupSize != undefined && groupSize > 0) {
                        progress = stat.like / groupSize * 100;
                    }

                    return (
                        <div key={stat.item.itemId}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div>{stat.item.name}</div>
                                {progress == 100 && (<div style={{color: '#FFBC6F'}}>Match!</div>)}
                            </div>
                            <BorderLinearProgress variant="determinate" value={progress}/>
                        </div>
                    )
                })
            }

        </Fragment>
    )
})


export default Statistics;