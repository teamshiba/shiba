/**
 * @desc when user wants to vote from the item list.
 */

import React, { FC, Fragment, useEffect } from "react";
import Header from "../../components/Header";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import InfoIcon from "@material-ui/icons/Info";
import TinderCard from "react-tinder-card";
import { votingStore } from "../../stores/voting-store";
import "./index.css";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { browserHistory } from "../../common/utils";
import { Clear, Equalizer, Favorite } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { groupStore } from "../../stores/group-store";
import { VotingItem } from "../../domain/voting-item";
import ButtonAdd from "../../components/ButtonAdd";
import VotingButton from "../../components/VotingButton";

const useStyles = makeStyles(() => ({
  statsButton: {
    color: "#6FCF97",
  },
  dislikeButton: {
    color: "#EB5757",
  },
  likeButton: {
    color: "#F2994A",
  },
  infoButton: {
    color: "#6FCF97",
  },
  rightButton: {
    float: "right",
    margin: "10px",
  },
}));

type IProps = RouteComponentProps<{ id: string }>;

const Voting: FC<IProps> = observer((props) => {
  const roomId = props.match.params["id"];
  const roomVotingStore = votingStore.room(roomId);
  const groupProfileStore = groupStore.room(roomId);
  const classes = useStyles();

  // Always do an update when page loads
  useEffect(() => {
    roomVotingStore.updateItems();
    groupProfileStore.update();
  }, []);

  // Polling for updates when there's no items left to swipe
  useEffect(() => {
    if (roomVotingStore.items.size > 0 || groupProfileStore.data?.isCompleted) {
      return;
    }

    const interval = setInterval(() => {
      roomVotingStore.updateItems();
      groupProfileStore.update();
    }, 3000);

    return () => clearInterval(interval);
  }, [roomVotingStore.items.size, groupProfileStore.data?.isCompleted]);

  if (groupProfileStore.data == null) return null;

  const onSwipe = (direction: string, item: string) => {
    roomVotingStore.vote(item, direction == "right" ? "like" : "dislike");
  };

  let content;
  const items = [...roomVotingStore.items.values()];
  if (roomVotingStore.items.size > 0) {
    content = (
      <div className="cardContainer">
        {items.map((item) => (
          <div className="swipe" key={item.itemId}>
            <TinderCard
              onSwipe={(dir) => onSwipe(dir, item.itemId)}
              preventSwipe={["up", "down"]}
            >
              <div
                style={{ backgroundImage: "url(" + item.imgURL + ")" }}
                className="card"
              >
                <h3>{item.name}</h3>
                <div className={classes.rightButton}>
                  <VotingButton
                    onClick={() => {
                      window.open(item.itemURL, "_blank");
                    }}
                    icon={InfoIcon}
                  />
                </div>
              </div>
            </TinderCard>
          </div>
        ))}
      </div>
    );
  } else if (groupProfileStore.data.isCompleted) {
    content = (
      <div className="message">
        This group is finished, click statistics button to see the result
      </div>
    );
  } else {
    const message = roomVotingStore.voted
      ? "Wait for other people to finish or click add button to add more items"
      : "Click add button to add more items";

    content = <div className="message">{message}</div>;
  }

  const currItem: VotingItem | null =
    items.length > 0 ? items[items.length - 1] : null;

  content = (
    <div className="screen">
      {content}
      <div className="voting-buttons">
        <VotingButton
          onClick={() => browserHistory.push(`/room/${roomId}/stats`)}
          icon={Equalizer}
          className={classes.statsButton}
        />
        <VotingButton
          onClick={() =>
            currItem && roomVotingStore.vote(currItem.itemId, "dislike")
          }
          disabled={currItem == null}
          icon={Clear}
          className={currItem && classes.dislikeButton}
        />
        <VotingButton
          onClick={() =>
            currItem && roomVotingStore.vote(currItem.itemId, "like")
          }
          disabled={currItem == null}
          icon={Favorite}
          className={currItem && classes.likeButton}
        />
        <ButtonAdd
          handleAdd={() => browserHistory.push(`/room/${roomId}/add`)}
          disabled={groupProfileStore.data.isCompleted}
        />
      </div>
    </div>
  );

  return (
    <Fragment>
      <Header
        hasBackButton
        buttons={
          <IconButton
            onClick={() => browserHistory.push(`/room/${roomId}/profile`)}
          >
            <EditOutlinedIcon />
          </IconButton>
        }
      >
        {groupProfileStore.data.roomName}
      </Header>
      {content}
    </Fragment>
  );
});

export default Voting;
