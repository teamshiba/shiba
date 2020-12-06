/**
 * @desc when user wants to vote from the item list.
 */

import React, { FC, ReactElement, useEffect, useState } from "react";
import Header from "../../components/Header";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import InfoIcon from "@material-ui/icons/Info";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import TinderCard from "react-tinder-card";
import { votingStore } from "../../stores/voting-store";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { browserHistory } from "../../common/utils";
import { Clear, Equalizer, Favorite } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { groupStore } from "../../stores/group-store";
import { VotingItem } from "../../domain/voting-item";
import ButtonAdd from "../../components/ButtonAdd";
import VotingButton from "../../components/VotingButton";
import { statisticsStore } from "../../stores/statistics-store";

interface VotingCardProps {
  items: VotingItem[];
  onSwipe?: (direction: "left" | "right", itemId: string) => void;
  flickOnSwipe?: boolean;
}

const useVotingCardStyles = makeStyles(() => ({
  rightButton: {
    float: "right",
    margin: "10px",
  },

  swipe: {
    position: "absolute",
    height: "inherit",

    "& div": {
      height: "inherit",
    },
  },

  cardContainer: {
    height: "70vh",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    position: "relative",
    backgroundColor: "#fff",
    width: "80vw",
    maxWidth: "300px",
    height: "100%",
    boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.30)",
    borderRadius: "20px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginTop: "2em",

    "& h3": {
      position: "absolute",
      bottom: 0,
      margin: "10px",
      color: "#fff",
    },
  },
}));

const VotingCard: FC<VotingCardProps> = (props) => {
  const classes = useVotingCardStyles();
  const flickOnSwipe = props.flickOnSwipe !== false;
  const handleSwipe = (dir: string, itemId: string) => {
    if (dir != "left" && dir != "right") return;
    const handler = props.onSwipe;
    handler && handler(dir, itemId);
  };

  return (
    <div className={classes.cardContainer}>
      {props.items.map((item) => (
        <div className={classes.swipe} key={item.itemId}>
          <TinderCard
            flickOnSwipe={flickOnSwipe}
            onSwipe={(dir) => handleSwipe(dir, item.itemId)}
            preventSwipe={["up", "down"]}
          >
            <div
              style={{ backgroundImage: "url(" + item.imgURL + ")" }}
              className={classes.card}
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
};

const useMessageStyles = makeStyles(() => ({
  message: {
    margin: "3em",
    textAlign: "center",
    fontSize: "1.5em",
    fontFamily: "sans-serif",
    color: "#cccccc",
  },
}));

const Message: FC = (props) => {
  const classes = useMessageStyles();
  return <div className={classes.message}>{props.children}</div>;
};

const useButtonStyles = makeStyles((theme) => ({
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

  resultMessage: {
    color: theme.palette.primary.main,
    fontFamily: "sans-serif",
    fontSize: "1.5em",
    lineHeight: "1.5em",
    height: "1.5em",
    textAlign: "center",
  },
}));

interface ScreenSkeletonProps {
  screen: ReactElement;
  buttons: ReactElement;
}

const useScreenSkeletonStyles = makeStyles(() => ({
  screen: {
    display: "flex",
    flexDirection: "column",
    height: "78vh",
    justifyContent: "space-between",
  },

  votingButtons: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    size: "24px",
  },
}));

const ScreenSkeleton: FC<ScreenSkeletonProps> = (props) => {
  const classes = useScreenSkeletonStyles();

  return (
    <>
      <div className={classes.screen}>{props.screen}</div>
      <div className={classes.votingButtons}>{props.buttons}</div>
    </>
  );
};

interface VotingScreenProps {
  items: VotingItem[];
  totalCount: number;
  onVote: (itemId: string, option: "like" | "dislike") => void;
  onGotoStats: () => void;
  onGotoAdd: () => void;
}

const VotingScreen: FC<VotingScreenProps> = (props) => {
  const classes = useButtonStyles();

  const onSwipe = (direction: string, item: string) => {
    props.onVote(item, direction == "right" ? "like" : "dislike");
  };

  const items = props.items;
  const currItem: VotingItem | null =
    items.length > 0 ? items[items.length - 1] : null;

  return (
    <ScreenSkeleton
      screen={
        items.length > 0 ? (
          <VotingCard items={items} onSwipe={onSwipe} />
        ) : (
          <Message>
            {props.totalCount > 0
              ? "Click add button to add more items or wait for other people to finish"
              : "Click add button to add items"}
          </Message>
        )
      }
      buttons={
        <>
          <VotingButton
            onClick={props.onGotoStats}
            icon={Equalizer}
            className={classes.statsButton}
          />
          <VotingButton
            onClick={() => currItem && onSwipe("left", currItem.itemId)}
            disabled={currItem == null}
            icon={Clear}
            className={currItem && classes.dislikeButton}
          />
          <VotingButton
            onClick={() => currItem && onSwipe("right", currItem.itemId)}
            disabled={currItem == null}
            icon={Favorite}
            className={currItem && classes.likeButton}
          />
          <ButtonAdd handleAdd={props.onGotoAdd} />
        </>
      }
    />
  );
};

interface ResultScreenProps {
  items: VotingItem[];
  onGotoStats: () => void;
}

const ResultScreen: FC<ResultScreenProps> = (props) => {
  const classes = useButtonStyles();
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = props.items;
  if (items.length == 0) {
    return (
      <ScreenSkeleton
        screen={
          <Message>
            No match is achieved, please refer to the statistics for detailed
            information
          </Message>
        }
        buttons={
          <VotingButton
            onClick={props.onGotoStats}
            icon={Equalizer}
            className={classes.statsButton}
          />
        }
      />
    );
  }

  if (items.length == 1) {
    const item = items[0];

    return (
      <ScreenSkeleton
        screen={<VotingCard flickOnSwipe={false} items={[item]} />}
        buttons={
          <>
            <VotingButton
              onClick={props.onGotoStats}
              icon={Equalizer}
              className={classes.statsButton}
            />
            <div className={classes.resultMessage}>A Match!</div>
          </>
        }
      />
    );
  }

  const onSwipe = (direction: string) => {
    setCurrentIndex((currentIndex) => {
      let newIndex = currentIndex + (direction == "left" ? -1 : 1);
      const len = items.length;
      if (newIndex < 0) {
        newIndex += len;
      }

      if (newIndex >= len) {
        newIndex -= len;
      }

      return newIndex;
    });
  };

  const displayItems = [
    ...items.slice(currentIndex),
    ...items.slice(0, currentIndex),
  ];

  return (
    <ScreenSkeleton
      screen={
        <VotingCard
          flickOnSwipe={false}
          items={displayItems}
          onSwipe={onSwipe}
        />
      }
      buttons={
        <>
          <VotingButton
            onClick={props.onGotoStats}
            icon={Equalizer}
            className={classes.statsButton}
          />
          <VotingButton
            onClick={() => onSwipe("left")}
            disabled={items.length == 1}
            icon={ChevronLeftIcon}
          />
          <VotingButton
            onClick={() => onSwipe("right")}
            disabled={items.length == 1}
            icon={ChevronRightIcon}
          />
          <div className={classes.resultMessage}>Matches!</div>
        </>
      }
    />
  );
};

type IProps = RouteComponentProps<{ id: string }>;

const Voting: FC<IProps> = observer((props) => {
  const roomId = props.match.params["id"];
  const roomVotingStore = votingStore.room(roomId);
  const roomStatStore = statisticsStore.room(roomId);
  const groupProfileStore = groupStore.room(roomId);

  // Always do an update when page loads
  useEffect(() => {
    roomVotingStore.updateItems();
    roomStatStore.updateStatistics();
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
      roomStatStore.updateStatistics();
    }, 3000);

    return () => clearInterval(interval);
  }, [roomVotingStore.items.size, groupProfileStore.data?.isCompleted]);

  const groupProfile = groupProfileStore.data;
  if (groupProfile == null) return null;

  const onGotoStats = () => browserHistory.push(`/room/${roomId}/stats`);

  return (
    <>
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
        {groupProfile.roomName}
      </Header>
      {groupProfile.isCompleted ? (
        <ResultScreen
          items={roomStatStore.statistics
            .filter((x) => x.like == groupProfile.members.length)
            .map((x) => x.items)}
          onGotoStats={onGotoStats}
        />
      ) : (
        <VotingScreen
          items={Array.from(roomVotingStore.items.values())}
          totalCount={roomVotingStore.totalCount}
          onVote={(itemId, option) => roomVotingStore.vote(itemId, option)}
          onGotoStats={onGotoStats}
          onGotoAdd={() => browserHistory.push(`/room/${roomId}/add`)}
        />
      )}
    </>
  );
});

export const __testExports = {
  ResultScreen,
};

export default Voting;
