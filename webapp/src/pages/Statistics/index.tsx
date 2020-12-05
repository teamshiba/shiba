/**
 * @desc the results of a matching process.
 */

import React, { FC, Fragment, useEffect } from "react";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Header from "../../components/Header";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import { groupStore } from "../../stores/group-store";
import { statisticsStore } from "../../stores/statistics-store";
import makeStyles from "@material-ui/core/styles/makeStyles";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#FFBC6F",
  },
}))(LinearProgress);

type IProps = RouteComponentProps<{ id: string }>;

const useStyles = makeStyles(() => ({
  itemContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "0.5em",
    marginBottom: "0.5em",
  },
  itemTitle: {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  itemLinkIcon: {
    fontSize: "0.8em",
    marginLeft: "0.5em",
  },
  matchMessage: {
    color: "#FFBC6F",
  },
}));

const Statistics: FC<IProps> = observer((props) => {
  const roomId = props.match.params["id"];
  const roomStatisticsStore = statisticsStore.room(roomId);
  const groupDetailStore = groupStore.room(roomId);
  const groupSize = groupDetailStore.data?.members.length;
  const classes = useStyles();

  useEffect(() => {
    roomStatisticsStore.updateStatistics();
    groupDetailStore.update();
  }, []);

  return (
    <Fragment>
      <Header hasBackButton>{groupDetailStore.data?.roomName}</Header>

      <h3>Top picks</h3>
      {roomStatisticsStore.statistics
        .slice()
        .sort((a, b) => b.like - a.like)
        .map((stat) => {
          let progress = 0;
          if (groupSize != undefined && groupSize > 0) {
            progress = (stat.like / groupSize) * 100;
          }

          const item = stat.items;

          return (
            <div key={item.itemId}>
              <div className={classes.itemContainer}>
                <div
                  className={classes.itemTitle}
                  onClick={() => window.open(item.itemURL, "_blank")}
                >
                  {item.name}
                  <OpenInNewIcon
                    className={classes.itemLinkIcon}
                    fontSize="inherit"
                  />
                </div>
                {progress == 100 && (
                  <div className={classes.matchMessage}>Match!</div>
                )}
              </div>
              <BorderLinearProgress variant="determinate" value={progress} />
            </div>
          );
        })}
    </Fragment>
  );
});

export default Statistics;
