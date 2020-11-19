/**
 * @desc the results of a matching process.
 */

import React, {FC, Fragment, useContext, useEffect} from "react";
import Header from "../../components/Header";
import StatisticsStore from "../../stores/statistics-store";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from "@material-ui/core/styles/withStyles";
import {groupStore} from "../../stores/group-store";

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
    const groupDetailStore = groupStore.room(roomId);
    const groupSize = groupDetailStore.data?.members.length;

    useEffect(() => {
        statisticsStore.updateStatistics();
        groupDetailStore.update();
    }, []);

    return (
        <Fragment>
            <Header hasBackButton>
                { groupDetailStore.data?.roomName }
            </Header>

            <h3>Top picks</h3>
            {
                statisticsStore.statistics.map(stat => {
                    let progress = 0;
                    if (groupSize != undefined && groupSize > 0) {
                        progress = stat.like / groupSize * 100;
                    }

                    return (
                        <p>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>{stat.item.name}</div>
                                { progress == 100 && (<div style={{ color: '#FFBC6F' }}>Match!</div>) }
                            </div>
                            <BorderLinearProgress variant="determinate" value={progress}/>
                        </p>
                    )
                })
            }

        </Fragment>
    )
})


export default Statistics;